const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');

const createSubmission = async (req, res) => {
  try {
    const { problemId, title, description, githubLink, fileUrl } = req.body;
    const userId = req.user.id;

    // Check if user is student
    const user = await User.findById(userId);
    if (user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit solutions' });
    }

    // Check if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Check if deadline has passed
    if (new Date() > problem.deadline) {
      return res.status(400).json({ message: 'Submission deadline has passed' });
    }

    const submission = new Submission({
      problemId,
      userId,
      title,
      description,
      githubLink,
      fileUrl
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id })
      .populate('problemId', 'title domain difficulty creditsReward')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getSubmissionsByProblem = async (req, res) => {
  try {
    const submissions = await Submission.find({ problemId: req.params.id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const reviewSubmission = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    const submissionId = req.params.id;

    const submission = await Submission.findById(submissionId).populate('problemId');
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check if current user is the problem creator
    if (submission.problemId.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to review this submission' });
    }

    submission.status = status;
    await submission.save();

    if (status === 'accepted') {
      // Add credits to user
      const user = await User.findById(submission.userId);
      user.credits += submission.problemId.creditsReward;
      await user.save();
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createSubmission, getMySubmissions, getSubmissionsByProblem, reviewSubmission };