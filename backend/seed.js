const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Problem = require('./models/Problem');
const Submission = require('./models/Submission');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await User.deleteMany({});
    await Problem.deleteMany({});
    await Submission.deleteMany({});

    console.log('Creating demo users...');

    // Create demo students
    const student1 = await User.create({
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'student',
      credits: 150
    });

    const student2 = await User.create({
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'student',
      credits: 75
    });

    // Create demo industry users
    const industry1 = await User.create({
      name: 'TechCorp Industries',
      email: 'tech@techcorp.com',
      password: await bcrypt.hash('password123', 10),
      role: 'industry'
    });

    const industry2 = await User.create({
      name: 'DataFlow Solutions',
      email: 'info@dataflow.com',
      password: await bcrypt.hash('password123', 10),
      role: 'industry'
    });

    console.log('Creating demo problems...');

    const problems = [
      {
        title: 'Build a fraud-detection dashboard for digital payments',
        description: 'We are shipping a payments platform for small businesses and need a dashboard that highlights suspicious transaction patterns in real time. The solution should ingest CSV or JSON data, flag high-risk transactions using rules and lightweight anomaly detection, and surface a clean summary for ops teams. Include a simple UI, API contract, and explanation of the detection logic.\n\nExpected deliverables:\n- Transaction ingestion flow\n- Risk scoring and alert rules\n- Summary dashboard with filters\n- README with setup instructions and assumptions',
        domain: 'Data Science',
        difficulty: 'hard',
        creditsReward: 650,
        deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        createdBy: industry1._id
      },
      {
        title: 'Create an AI resume screener prototype',
        description: 'Design a lightweight applicant screening tool that reads candidate resumes, extracts key skills and experience, and ranks applicants based on a weighted rubric. The prototype should accept uploaded PDFs or text input, parse relevant fields, and produce a ranked shortlist with justifications.\n\nConstraints:\n- Keep the architecture simple and explainable\n- Must work for at least 10 sample resumes\n- Include scoring criteria and tradeoffs',
        domain: 'AI/ML',
        difficulty: 'hard',
        creditsReward: 700,
        deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        createdBy: industry2._id
      },
      {
        title: 'Build a real-time project tracker for product teams',
        description: 'We need a team dashboard for tracking delivery risk across multiple workstreams. The app should support project cards, status updates, assignee filters, and a timeline view. Focus on fast interaction, clean UX, and a reliable data model for Kanban-like planning.\n\nPlease include a simple backend API and frontend UI, and describe how the app handles edge cases like overdue tasks or blocked dependencies.',
        domain: 'Web Development',
        difficulty: 'medium',
        creditsReward: 450,
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        createdBy: industry1._id
      },
      {
        title: 'Design a secure customer support triage workflow',
        description: 'Create a support workflow for a SaaS product that routes incoming tickets based on severity, account type, and issue category. The solution should include authentication-aware access control, queue prioritization, and a dashboard for agents. We value clarity, resilience, and maintainability over flashy visuals.\n\nDeliverables should include the architecture, data model, and API flow for the ticket lifecycle.',
        domain: 'System Design',
        difficulty: 'hard',
        creditsReward: 600,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        createdBy: industry2._id
      },
      {
        title: 'Optimize SQL queries for a retail analytics pipeline',
        description: 'Our analytics engine is slowing down during nightly reporting. We need help identifying bottlenecks in the current SQL queries and improving both execution time and cost. The final answer should include query explanations, index recommendations, and benchmark comparisons before and after optimization.\n\nUse a realistic retail dataset schema and explain the tradeoffs between normalization and performance.',
        domain: 'Data Science',
        difficulty: 'medium',
        creditsReward: 420,
        deadline: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
        createdBy: industry1._id
      },
      {
        title: 'Build a mobile dashboard for field technicians',
        description: 'Create a mobile-first app for technicians working in the field. The app should allow them to view assigned jobs, update task progress, upload image evidence, and see their route/schedule. It should be responsive, reliable offline, and easy to use in low-connectivity areas.\n\nFocus on working within limited mobile data and poor network conditions.',
        domain: 'Mobile Development',
        difficulty: 'medium',
        creditsReward: 500,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        createdBy: industry2._id
      },
      {
        title: 'Create a CI/CD pipeline for a microservice deployment',
        description: 'Set up a deploy pipeline for a containerized application running across staging and production environments. Include linting, automated tests, image build, registry push, deployment checks, and rollback strategy. The solution should be production-ready and easy to reason about in a multi-service setup.\n\nShow the workflow and suggest safeguards against accidental production releases.',
        domain: 'DevOps',
        difficulty: 'medium',
        creditsReward: 480,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        createdBy: industry1._id
      },
      {
        title: 'Build a subscription analytics and churn prediction model',
        description: 'Develop a prototype that analyzes subscription usage patterns and predicts churn risk from customer activity. Include feature engineering, model selection, performance metrics, and a short business summary for stakeholders.\n\nThe model should be interpretable and should not require expensive setup beyond a standard Python environment.',
        domain: 'AI/ML',
        difficulty: 'hard',
        creditsReward: 680,
        deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        createdBy: industry2._id
      }
    ];

    const createdProblems = await Problem.insertMany(problems);

    console.log('Creating demo submissions...');

    const submissions = [
      {
        problemId: createdProblems[0]._id,
        userId: student1._id,
        title: 'Real-time Chat App using Socket.io',
        description: 'Implemented a fully functional chat application with React frontend and Node.js backend. Features include user authentication, message persistence, typing indicators, and online status.',
        githubLink: 'https://github.com/alice/chat-app',
        status: 'accepted'
      },
      {
        problemId: createdProblems[1]._id,
        userId: student2._id,
        title: 'CNN Model for Image Classification',
        description: 'Built a convolutional neural network using PyTorch achieving 87% accuracy on CIFAR-10 dataset. Used data augmentation techniques to improve generalization.',
        githubLink: 'https://github.com/bob/cifar10-classifier',
        status: 'pending'
      },
      {
        problemId: createdProblems[2]._id,
        userId: student1._id,
        title: 'Database Query Optimization',
        description: 'Optimized slow queries by creating appropriate indexes and rewriting complex SQL statements. Achieved 80% improvement in query performance.',
        githubLink: 'https://github.com/alice/db-optimization',
        status: 'accepted'
      },
      {
        problemId: createdProblems[3]._id,
        userId: student2._id,
        title: 'Microservices Architecture Design',
        description: 'Designed and documented a complete microservices architecture including service discovery, load balancing, and inter-service communication patterns.',
        fileUrl: 'https://example.com/architecture.pdf',
        status: 'pending'
      },
      {
        problemId: createdProblems[4]._id,
        userId: student1._id,
        title: 'Docker-based CI/CD Pipeline',
        description: 'Created an automated CI/CD pipeline using Docker, GitHub Actions, and Kubernetes. Implemented automated testing and deployment strategies.',
        githubLink: 'https://github.com/alice/cicd-pipeline',
        status: 'accepted'
      }
    ];

    await Submission.insertMany(submissions);

    // Update student credits after accepted submissions
    await User.findByIdAndUpdate(student1._id, {
      credits: student1.credits + 500 + 350 + 400
    });

    console.log('✅ Database seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('Student: alice@example.com / password123');
    console.log('Student: bob@example.com / password123');
    console.log('Industry: tech@techcorp.com / password123');
    console.log('Industry: info@dataflow.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();