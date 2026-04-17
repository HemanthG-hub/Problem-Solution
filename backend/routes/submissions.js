const express = require('express');
const { createSubmission, getMySubmissions, getSubmissionsByProblem, reviewSubmission } = require('../controllers/submissionsController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createSubmission);
router.get('/my', authMiddleware, getMySubmissions);
router.get('/problem/:id', authMiddleware, getSubmissionsByProblem);
router.patch('/:id/review', authMiddleware, reviewSubmission);

module.exports = router;