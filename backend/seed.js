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
        title: 'Build a Real-time Chat Application',
        description: 'Create a full-stack chat application with real-time messaging capabilities using WebSockets. The application should support multiple users, message history, and user online status indicators.',
        domain: 'Web Development',
        difficulty: 'hard',
        creditsReward: 500,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdBy: industry1._id
      },
      {
        title: 'Implement ML Model for Image Classification',
        description: 'Build a machine learning model that can classify images from the CIFAR-10 dataset. Use TensorFlow or PyTorch and achieve at least 85% accuracy. Include data preprocessing, model training, and evaluation metrics.',
        domain: 'AI/ML',
        difficulty: 'hard',
        creditsReward: 600,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        createdBy: industry2._id
      },
      {
        title: 'Optimize E-commerce Database Queries',
        description: 'Optimize slow database queries in an e-commerce platform. Create appropriate indexes, refactor queries, and improve overall database performance. Provide before/after benchmarks.',
        domain: 'Data Science',
        difficulty: 'medium',
        creditsReward: 350,
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        createdBy: industry1._id
      },
      {
        title: 'Design a Microservices Architecture',
        description: 'Design a scalable microservices architecture for a social media platform. Include API gateway, authentication service, user service, and post service. Document your architecture decisions.',
        domain: 'System Design',
        difficulty: 'hard',
        creditsReward: 550,
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        createdBy: industry2._id
      },
      {
        title: 'Build CI/CD Pipeline Using Docker',
        description: 'Create a complete CI/CD pipeline using Docker and Kubernetes. Automate testing, building, and deployment processes. Include health checks and rollback capabilities.',
        domain: 'DevOps',
        difficulty: 'medium',
        creditsReward: 400,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        createdBy: industry1._id
      },
      {
        title: 'Create Cross-Platform Mobile App',
        description: 'Develop a cross-platform mobile application using React Native for a task management system. Support offline functionality, sync, and push notifications.',
        domain: 'Mobile Development',
        difficulty: 'medium',
        creditsReward: 380,
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        createdBy: industry2._id
      },
      {
        title: 'Build REST API with Authentication',
        description: 'Create a RESTful API for a blog platform with JWT authentication, role-based access control, and comprehensive error handling. Include rate limiting and input validation.',
        domain: 'Web Development',
        difficulty: 'easy',
        creditsReward: 200,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        createdBy: industry1._id
      },
      {
        title: 'Analyze Big Data Using Spark',
        description: 'Process and analyze a large dataset using Apache Spark. Perform data cleaning, transformation, and generate insights. Create visualizations for the results.',
        domain: 'Data Science',
        difficulty: 'hard',
        creditsReward: 520,
        deadline: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
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