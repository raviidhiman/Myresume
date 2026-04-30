const express = require('express');
const router = express.Router();

const Resume = require('../models/Resume');
const authMiddleware = require('../middleware/auth');

// Default resume seed data
const defaultResume = {
  personal: {
    name: 'Arjun Sharma',
    email: 'arjun.sharma@example.com',
    phone: '+91 98765 43210',
    linkedin: 'linkedin.com/in/arjunsharma',
    github: 'github.com/arjunsharma',
    website: 'arjunsharma.dev',
    location: 'New Delhi, India',
    summary:
      'Final year B.Tech student specializing in Computer Science with a focus on full-stack development, machine learning, and distributed systems. Passionate about building scalable products with real-world impact.',
  },
  education: [
    {
      institution: 'Indian Institute of Technology Delhi',
      degree: 'B.Tech',
      field: 'Computer Science & Engineering',
      startYear: '2021',
      endYear: '2025',
      grade: 'CGPA: 8.9 / 10',
      location: 'New Delhi, India',
      order: 0,
    },
    {
      institution: 'Delhi Public School',
      degree: 'Class XII (CBSE)',
      field: 'Science (PCM)',
      startYear: '2019',
      endYear: '2021',
      grade: '96.4%',
      location: 'New Delhi, India',
      order: 1,
    },
  ],
  experience: [
    {
      company: 'Google Summer of Code',
      role: 'Open Source Developer',
      startDate: 'May 2024',
      endDate: 'Aug 2024',
      location: 'Remote',
      bullets: [
        "Contributed to TensorFlow's model optimization pipeline, reducing inference latency by 18%.",
        'Implemented quantization-aware training for edge deployment targets.',
        'Collaborated with 4 senior engineers across 3 time zones.',
      ],
      order: 0,
    },
    {
      company: 'Razorpay',
      role: 'Software Engineering Intern',
      startDate: 'Dec 2023',
      endDate: 'Feb 2024',
      location: 'Bengaluru, India',
      bullets: [
        'Built a real-time fraud detection microservice handling 50K+ transactions/day.',
        'Optimized database queries reducing average response time from 340ms to 80ms.',
        'Wrote comprehensive unit and integration tests achieving 92% code coverage.',
      ],
      order: 1,
    },
  ],
  projects: [
    {
      title: 'Distributed Task Scheduler',
      description:
        'A fault-tolerant distributed task scheduler with leader election and work-stealing algorithm supporting 10K+ concurrent jobs.',
      tech: ['Go', 'etcd', 'gRPC', 'Docker'],
      github: 'github.com/arjunsharma/dist-scheduler',
      link: '',
      order: 0,
    },
    {
      title: 'Resume AI — This App',
      description:
        'Full-stack resume platform with OTP authentication, LaTeX-style design, live editing, and PDF export.',
      tech: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
      github: 'github.com/arjunsharma/resume-ai',
      link: 'arjunsharma.dev/resume',
      order: 1,
    },
    {
      title: 'Neural Image Captioner',
      description:
        'Encoder-decoder architecture using ResNet50 + LSTM for automatic image captioning, achieving BLEU-4 score of 0.312.',
      tech: ['Python', 'PyTorch', 'NLTK', 'Flask'],
      github: 'github.com/arjunsharma/img-captioner',
      link: '',
      order: 2,
    },
  ],
  skills: [
    {
      category: 'Languages',
      items: ['C++', 'Python', 'JavaScript', 'TypeScript', 'Go', 'SQL'],
      order: 0,
    },
    {
      category: 'Frameworks & Libraries',
      items: ['React.js', 'Node.js', 'Express.js', 'FastAPI', 'PyTorch', 'TensorFlow'],
      order: 1,
    },
    {
      category: 'Tools & Platforms',
      items: ['Git', 'Docker', 'Kubernetes', 'AWS', 'MongoDB', 'PostgreSQL', 'Redis'],
      order: 2,
    },
    {
      category: 'Concepts',
      items: ['Data Structures', 'System Design', 'REST APIs', 'CI/CD', 'Agile'],
      order: 3,
    },
  ],
  achievements: [
    {
      title: 'ACM ICPC Regionalist',
      description: 'Qualified for ICPC Asia Regionals, ranked in top 50 nationally.',
      year: '2023',
      order: 0,
    },
    {
      title: 'Smart India Hackathon Winner',
      description: 'Led a 6-member team to win SIH 2023 in the healthcare domain.',
      year: '2023',
      order: 1,
    },
    {
      title: 'Google HashCode — Top 5% Globally',
      description: 'Achieved global rank 847 out of 18,000+ participating teams.',
      year: '2024',
      order: 2,
    },
  ],
  sectionOrder: ['education', 'experience', 'projects', 'skills', 'achievements'],
};

// ─── GET /resume — Public ─────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    let resume = await Resume.findOne();

    if (!resume) {
      resume = await Resume.create(defaultResume);
    }

    res.json(resume);
  } catch (err) {
    console.error('Get resume error:', err);
    res.status(500).json({ message: 'Failed to fetch resume.' });
  }
});

// ─── PUT /resume — Protected ──────────────────────────────────
router.put('/', authMiddleware, async (req, res) => {
  try {
    const updates = req.body;

    // Remove immutable fields
    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;

    let resume = await Resume.findOne();

    if (!resume) {
      resume = await Resume.create(updates);
    } else {
      resume = await Resume.findByIdAndUpdate(
        resume._id,
        { $set: updates },
        { new: true, runValidators: true }
      );
    }

    res.json({ message: 'Resume updated successfully.', resume });
  } catch (err) {
    console.error('Update resume error:', err);
    res.status(500).json({ message: 'Failed to update resume.' });
  }
});

// ─── POST /resume/reset — Protected (dev helper) ──────────────
router.post('/reset', authMiddleware, async (req, res) => {
  try {
    await Resume.deleteMany();
    const resume = await Resume.create(defaultResume);
    res.json({ message: 'Resume reset to default.', resume });
  } catch (err) {
    res.status(500).json({ message: 'Reset failed.' });
  }
});

module.exports = router;
