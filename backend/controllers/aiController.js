const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');
const { findDuplicateSubmissions, analyzeSubmissionQuality } = require('../utils/aiHelper');

// Get submissions with duplicate detection and quality analysis
const getSubmissionsWithDuplicateAnalysis = async (req, res) => {
  try {
    const { problemId } = req.params;

    // Verify user is the industry owner of this problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    if (problem.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to review these submissions' });
    }

    // Fetch all submissions for this problem with user details
    const submissions = await Submission.find({ problemId })
      .populate('userId', 'name email role')
      .sort({ createdAt: 1 }); // Oldest first (first-come-first-served)

    // Analyze duplicates
    const { unique, duplicates, totalSubmissions } = findDuplicateSubmissions(submissions);

    // Analyze quality of each unique submission
    const uniqueWithQuality = unique.map(submission => ({
      ...submission,
      qualityAnalysis: analyzeSubmissionQuality(submission)
    }));

    const response = {
      totalSubmissions,
      uniqueCount: uniqueWithQuality.length,
      duplicateCount: duplicates.length,
      uniqueSubmissions: uniqueWithQuality,
      duplicateSubmissions: duplicates.map(dup => ({
        ...dup,
        qualityAnalysis: analyzeSubmissionQuality(dup)
      })),
      summary: {
        message: `Found ${duplicates.length} similar/duplicate submissions out of ${totalSubmissions}. Showing ${uniqueWithQuality.length} unique solutions in order of submission.`,
        recommendation: `Review the ${uniqueWithQuality.length} unique solutions. Duplicates are marked and can be viewed for reference.`
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error in duplicate analysis:', error);
    res.status(500).json({ message: 'Server error during analysis' });
  }
};

// Get smart insights for a problem's submissions
const getSubmissionInsights = async (req, res) => {
  try {
    const { problemId } = req.params;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    if (problem.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const submissions = await Submission.find({ problemId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const stats = {
      total: submissions.length,
      pending: submissions.filter(s => s.status === 'pending').length,
      accepted: submissions.filter(s => s.status === 'accepted').length,
      rejected: submissions.filter(s => s.status === 'rejected').length,
      averageQualityScore: 0
    };

    // Handle case where there are no submissions
    if (submissions.length === 0) {
      return res.json({
        stats,
        bestSubmission: null,
        patterns: { codeLinksIncluded: 0, filesAttached: 0, wellDocumented: 0 },
        insights: {
          recommendation: 'No submissions yet for this problem.',
          bestPractices: []
        }
      });
    }

    // Analyze all submissions
    const analyzed = submissions.map(sub => ({
      ...sub.toObject ? sub.toObject() : sub,
      qualityAnalysis: analyzeSubmissionQuality(sub)
    }));

    // Safe average — analyzed.length is guaranteed > 0 here
    stats.averageQualityScore = (
      analyzed.reduce((sum, sub) => sum + sub.qualityAnalysis.qualityScore, 0) /
      analyzed.length
    ).toFixed(2);

    // Find best submission — safe because analyzed is non-empty
    const bestSubmission = analyzed.reduce((best, current) =>
      current.qualityAnalysis.qualityScore > best.qualityAnalysis.qualityScore ? current : best
    , analyzed[0]);

    // Identify patterns
    const patterns = {
      codeLinksIncluded: analyzed.filter(s => s.qualityAnalysis.indicators.hasCodeLink).length,
      filesAttached: analyzed.filter(s => s.qualityAnalysis.indicators.hasFileAttachment).length,
      wellDocumented: analyzed.filter(s => s.qualityAnalysis.indicators.hasKeywords.documented).length
    };

    res.json({
      stats,
      bestSubmission: {
        id: bestSubmission._id,
        studentName: bestSubmission.userId.name,
        qualityScore: bestSubmission.qualityAnalysis.qualityScore,
        recommendation: bestSubmission.qualityAnalysis.recommendation
      },
      patterns,
      insights: {
        recommendation: `Out of ${stats.total} submissions, ${stats.averageQualityScore >= 5 ? 'quality is good' : 'consider reviewing quality standards'}. Top submission has score ${bestSubmission.qualityAnalysis.qualityScore}/10.`,
        bestPractices: analyzed.filter(s => s.qualityAnalysis.qualityScore >= 7)
      }
    });
  } catch (error) {
    console.error('Error getting insights:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSubmissionsWithDuplicateAnalysis,
  getSubmissionInsights
};
