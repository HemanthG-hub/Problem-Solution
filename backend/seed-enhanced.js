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
    const students = [];
    const studentNames = ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Chen', 'Emma Davis', 'Frank Miller'];
    for (let i = 0; i < studentNames.length; i++) {
      students.push(await User.create({
        name: studentNames[i],
        email: `student${i+1}@example.com`,
        password: await bcrypt.hash('password123', 10),
        role: 'student',
        credits: Math.floor(Math.random() * 300) + 50
      }));
    }

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
        description: 'Create a full-stack chat application with real-time messaging capabilities using WebSockets. The application should support multiple users, message history, and user online status indicators. Include features like typing indicators and read receipts.',
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
        description: 'Optimize slow database queries in an e-commerce platform. Create appropriate indexes, refactor queries, and improve overall database performance. Provide before/after benchmarks showing 50% improvement minimum.',
        domain: 'Database',
        difficulty: 'medium',
        creditsReward: 350,
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        createdBy: industry1._id
      },
      {
        title: 'Design a Microservices Architecture',
        description: 'Design a scalable microservices architecture for a social media platform. Include API gateway, authentication service, user service, and post service. Document your architecture decisions and provide deployment strategy.',
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
      }
    ];

    const createdProblems = await Problem.insertMany(problems);

    console.log('Creating demo submissions with similar solutions...');

    const submissions = [
      // Chat App Solutions (Problem 0) - Multiple similar submissions
      {
        problemId: createdProblems[0]._id,
        userId: students[0]._id,
        title: 'Real-time Chat App using Socket.io and React',
        description: 'Implemented a fully functional chat application with React frontend and Node.js backend. Features include user authentication with JWT, message persistence in MongoDB, typing indicators, and real-time online status. Used Socket.io for WebSocket communication.',
        githubLink: 'https://github.com/alice/chat-app',
        fileUrl: 'https://drive.google.com/file/chat-app-v1.zip',
        status: 'accepted'
      },
      {
        problemId: createdProblems[0]._id,
        userId: students[1]._id,
        title: 'Chat Application with Real-time Messaging',
        description: 'Built a real-time chat application using React and Node.js with Socket.io. Includes JWT authentication, MongoDB database for message storage, typing indicators showing when users are typing, and live online status updates.',
        githubLink: 'https://github.com/bob/realtime-chat',
        fileUrl: 'https://drive.google.com/file/chat-solution.zip',
        status: 'pending'
      },
      {
        problemId: createdProblems[0]._id,
        userId: students[2]._id,
        title: 'Socket.io Chat Platform',
        description: 'Created a chat platform with real-time messaging using Socket.io and Express. Implemented user authentication, persistent message storage, typing indicators, and online status. Frontend built with React, backend with Node.js Express.',
        githubLink: 'https://github.com/carol/socket-chat',
        status: 'pending'
      },
      {
        problemId: createdProblems[0]._id,
        userId: students[3]._id,
        title: 'Real-time Chat with WebSockets',
        description: 'Developed a chat application using WebSockets for real-time communication. Includes JWT authentication, message persistence, typing indicators, user online status. Built with React and Node.js Express backend.',
        githubLink: 'https://github.com/david/websocket-chat',
        status: 'pending'
      },
      {
        problemId: createdProblems[0]._id,
        userId: students[4]._id,
        title: 'Unique Chat Implementation with Firebase',
        description: 'Built chat application using Firebase Realtime Database instead of Socket.io. Includes cloud authentication, automatic message sync, presence detection, and React Native support for mobile.',
        githubLink: 'https://github.com/emma/firebase-chat',
        fileUrl: 'https://drive.google.com/file/firebase-chat-app.zip',
        status: 'pending'
      },
      // Duplicate of Alice's submission
      {
        problemId: createdProblems[0]._id,
        userId: students[5]._id,
        title: 'Real-time Chat App using Socket.io and React',
        description: 'Implemented a fully functional chat application with React frontend and Node.js backend. Features include user authentication with JWT, message persistence in MongoDB, typing indicators, and real-time online status. Used Socket.io for WebSocket communication.',
        githubLink: 'https://github.com/frank/chat-app-copy',
        fileUrl: 'https://drive.google.com/file/chat-app-v1.zip',
        status: 'pending'
      },
      // Near duplicate of Bob's submission
      {
        problemId: createdProblems[0]._id,
        userId: students[1]._id,
        title: 'Chat Application with Real-time Messaging System',
        description: 'Built a real-time chat application using React and Node.js with Socket.io. Includes JWT authentication, MongoDB database for message storage, typing indicators showing when users are typing, and live online status updates.',
        githubLink: 'https://github.com/bob/realtime-chat-v2',
        status: 'pending'
      },

      // ML Model Solutions (Problem 1) - Multiple similar submissions
      {
        problemId: createdProblems[1]._id,
        userId: students[0]._id,
        title: 'CIFAR-10 CNN Model with 88% Accuracy',
        description: 'Implemented a Convolutional Neural Network using TensorFlow/Keras for CIFAR-10 classification. Achieved 88% test accuracy with data augmentation. Includes data preprocessing, model architecture, training process, and evaluation metrics.',
        githubLink: 'https://github.com/alice/ml-cifar-10',
        fileUrl: 'https://drive.google.com/file/cifar-model.h5',
        status: 'accepted'
      },
      {
        problemId: createdProblems[1]._id,
        userId: students[1]._id,
        title: 'Image Classification with CNN',
        description: 'Created a CNN model for CIFAR-10 dataset achieving 86% accuracy. Used TensorFlow for model building. Includes comprehensive data preprocessing, model training with validation, and detailed performance evaluation.',
        githubLink: 'https://github.com/bob/image-classifier',
        status: 'pending'
      },
      {
        problemId: createdProblems[1]._id,
        userId: students[2]._id,
        title: 'Deep Learning CIFAR-10 Solution',
        description: 'Built a deep CNN for CIFAR-10 classification with 87% accuracy using PyTorch. Implemented data augmentation, batch normalization, and dropout. Includes training curves and confusion matrix analysis.',
        githubLink: 'https://github.com/carol/deep-learning-cifar',
        status: 'pending'
      },
      {
        problemId: createdProblems[1]._id,
        userId: students[3]._id,
        title: 'Advanced CNN with Transfer Learning',
        description: 'Implemented CIFAR-10 classifier using transfer learning with ResNet backbone. Achieved 92% accuracy by fine-tuning pre-trained model. Includes comprehensive documentation and performance comparison.',
        githubLink: 'https://github.com/david/transfer-learning-cifar',
        status: 'pending'
      },

      // Database Optimization Solutions (Problem 2)
      {
        problemId: createdProblems[2]._id,
        userId: students[2]._id,
        title: 'Database Query Optimization Report',
        description: 'Optimized slow e-commerce queries by adding composite indexes on frequently searched columns. Reduced query time from 2.5s to 0.8s (68% improvement). Included query analysis, execution plans, and recommendations.',
        githubLink: 'https://github.com/carol/db-optimization',
        fileUrl: 'https://drive.google.com/file/optimization-report.pdf',
        status: 'accepted'
      },
      {
        problemId: createdProblems[2]._id,
        userId: students[4]._id,
        title: 'E-commerce Database Performance Improvement',
        description: 'Analyzed and optimized database queries for e-commerce platform. Created indexes on product search, improved JOIN queries, implemented caching. Achieved 55% average query time reduction.',
        githubLink: 'https://github.com/emma/ecommerce-db-tuning',
        status: 'pending'
      },

      // Microservices Architecture Solutions (Problem 3)
      {
        problemId: createdProblems[3]._id,
        userId: students[1]._id,
        title: 'Social Media Microservices Architecture',
        description: 'Designed comprehensive microservices architecture with API Gateway, Auth Service, User Service, and Post Service. Includes service discovery, load balancing strategy, and inter-service communication patterns.',
        githubLink: 'https://github.com/bob/social-media-arch',
        fileUrl: 'https://drive.google.com/file/architecture-diagram.pdf',
        status: 'accepted'
      },
      {
        problemId: createdProblems[3]._id,
        userId: students[3]._id,
        title: 'Scalable Microservices Design',
        description: 'Created detailed microservices design for social platform with separate services for authentication, users, and posts. Includes API Gateway setup, service communication, data consistency strategies, and deployment considerations.',
        githubLink: 'https://github.com/david/microservices-design',
        status: 'pending'
      },

      // CI/CD Pipeline Solutions (Problem 4)
      {
        problemId: createdProblems[4]._id,
        userId: students[0]._id,
        title: 'Docker & Kubernetes CI/CD Pipeline',
        description: 'Built complete CI/CD pipeline using Docker and Kubernetes. Automated testing, image building, registry push, and deployment. Includes health checks, automated rollback on failure, and monitoring.',
        githubLink: 'https://github.com/alice/cicd-pipeline',
        fileUrl: 'https://drive.google.com/file/pipeline-config.yaml',
        status: 'accepted'
      },
      {
        problemId: createdProblems[4]._id,
        userId: students[5]._id,
        title: 'Containerized Deployment Pipeline',
        description: 'Implemented automated CI/CD using Docker containers and Kubernetes orchestration. Features include automated testing, image building, health checks, and zero-downtime deployments with canary releases.',
        githubLink: 'https://github.com/frank/k8s-cicd',
        status: 'pending'
      }
    ];

    const createdSubmissions = await Submission.insertMany(submissions);

    console.log('✅ Database seeded successfully!');
    console.log(`Created ${students.length} students + 2 industries`);
    console.log(`Created ${createdProblems.length} problems`);
    console.log(`Created ${createdSubmissions.length} submissions with duplicate examples`);
    
    console.log('\n🎓 Demo Credentials:');
    console.log('Students:');
    studentNames.forEach((name, i) => {
      console.log(`  ${name}: student${i+1}@example.com / password123`);
    });
    console.log('Industry:');
    console.log('  TechCorp Industries: tech@techcorp.com / password123');
    console.log('  DataFlow Solutions: info@dataflow.com / password123');

    console.log('\n🔍 Duplicate Detection Demo:');
    console.log('  - Chat App (Problem 1): 4 similar submissions (Alice\'s is first = will be marked as unique)');
    console.log('  - ML Model (Problem 2): 3 similar submissions (Alice\'s is first = will be marked as unique)');
    console.log('  - Others will have unique solutions');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
