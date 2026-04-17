const express = require('express');
const { createProblem, getProblems, getProblemById } = require('../controllers/problemsController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createProblem);
router.get('/', getProblems);
router.get('/:id', getProblemById);

module.exports = router;