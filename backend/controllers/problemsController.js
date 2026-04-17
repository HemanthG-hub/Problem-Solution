const Problem = require('../models/Problem');
const User = require('../models/User');

const createProblem = async (req, res) => {
  try {
    const { title, description, domain, difficulty, creditsReward, deadline } = req.body;
    const createdBy = req.user.id;

    // Check if user is industry
    const user = await User.findById(createdBy);
    if (user.role !== 'industry') {
      return res.status(403).json({ message: 'Only industry users can create problems' });
    }

    const problem = new Problem({
      title,
      description,
      domain,
      difficulty,
      creditsReward,
      deadline: new Date(deadline),
      createdBy
    });

    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).populate('createdBy', 'name email');
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createProblem, getProblems, getProblemById };