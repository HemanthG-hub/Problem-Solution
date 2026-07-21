const express = require('express');
const { createSubmission, getMySubmissions, getSubmissionsByProblem, reviewSubmission } = require('../controllers/submissionsController');
const { getSubmissionsWithDuplicateAnalysis, getSubmissionInsights } = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createSubmission);
router.get('/my', authMiddleware, getMySubmissions);
// AI routes must come BEFORE /problem/:id to avoid route matching conflicts
router.get('/ai/analysis/:problemId', authMiddleware, getSubmissionsWithDuplicateAnalysis);
router.get('/ai/insights/:problemId', authMiddleware, getSubmissionInsights);
router.get('/problem/:id', authMiddleware, getSubmissionsByProblem);
router.patch('/:id/review', authMiddleware, reviewSubmission);

module.exports = router;