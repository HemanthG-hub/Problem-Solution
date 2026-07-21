const axios = require('axios');

// Simple text similarity using Jaccard similarity (no API required)
const calculateSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;
  
  // Convert to lowercase and split into words
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));
  
  // Calculate Jaccard similarity
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
};

// Detect similar/duplicate submissions
const findDuplicateSubmissions = (submissions, threshold = 0.35) => {
  const duplicates = [];
  const unique = [];
  const processed = new Set();

  // Sort by creation date (first come first served)
  const sortedSubmissions = [...submissions].sort((a, b) => 
    new Date(a.createdAt) - new Date(b.createdAt)
  );

  sortedSubmissions.forEach((submission, index) => {
    if (processed.has(submission._id.toString())) return;

    // Check against all other submissions
    let isDuplicate = false;
    let duplicateOf = null;

    for (let j = 0; j < index; j++) {
      const otherSubmission = sortedSubmissions[j];
      if (processed.has(otherSubmission._id.toString())) continue;

      // Calculate similarity between descriptions
      const descSimilarity = calculateSimilarity(
        submission.description,
        otherSubmission.description
      );

      // Also check title similarity
      const titleSimilarity = calculateSimilarity(
        submission.title,
        otherSubmission.title
      );

      const overallSimilarity = (descSimilarity + titleSimilarity) / 2;

      if (overallSimilarity >= threshold) {
        isDuplicate = true;
        duplicateOf = otherSubmission._id;
        break;
      }
    }

    if (isDuplicate) {
      duplicates.push({
        ...submission.toObject ? submission.toObject() : submission,
        isDuplicate: true,
        duplicateOf,
        similarity: 'High match'
      });
      processed.add(submission._id.toString());
    } else {
      unique.push({
        ...submission.toObject ? submission.toObject() : submission,
        isDuplicate: false,
        position: unique.length + 1
      });
      processed.add(submission._id.toString());
    }
  });

  return { unique, duplicates, totalSubmissions: submissions.length };
};

// Analyze submission quality using keyword analysis
const analyzeSubmissionQuality = (submission) => {
  const description = (submission.description || '').toLowerCase();
  const code = (submission.githubLink || '') + (submission.fileUrl || '');

  const qualityIndicators = {
    hasCodeLink: !!submission.githubLink,
    hasFileAttachment: !!submission.fileUrl,
    hasDetailedDescription: description.length > 100,
    hasKeywords: {
      tested: description.includes('test'),
      documented: description.includes('document') || description.includes('comment'),
      optimized: description.includes('optim'),
      scalable: description.includes('scale'),
      secure: description.includes('secure') || description.includes('safe')
    }
  };

  // Calculate quality score
  let qualityScore = 0;
  if (qualityIndicators.hasCodeLink) qualityScore += 2;
  if (qualityIndicators.hasFileAttachment) qualityScore += 1;
  if (qualityIndicators.hasDetailedDescription) qualityScore += 2;
  Object.values(qualityIndicators.hasKeywords).forEach(val => {
    if (val) qualityScore += 1;
  });

  return {
    qualityScore: Math.min(qualityScore, 10),
    indicators: qualityIndicators,
    recommendation: qualityScore >= 6 ? 'Excellent' : qualityScore >= 4 ? 'Good' : 'Needs Improvement'
  };
};

// Use Hugging Face API for advanced NLP (optional, if API key provided)
const getHuggingFaceEmbedding = async (text) => {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    console.log('Hugging Face API key not configured. Using local similarity analysis.');
    return null;
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2',
      { inputs: text },
      {
        headers: { Authorization: `Bearer ${apiKey}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Hugging Face API error:', error.message);
    return null;
  }
};

// Calculate cosine similarity between embeddings
const cosineSimilarity = (a, b) => {
  const dotProduct = a.reduce((sum, val, idx) => sum + val * b[idx], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

module.exports = {
  calculateSimilarity,
  findDuplicateSubmissions,
  analyzeSubmissionQuality,
  getHuggingFaceEmbedding,
  cosineSimilarity
};
