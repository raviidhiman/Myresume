const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, default: '' },
  startYear: { type: String, required: true },
  endYear: { type: String, default: 'Present' },
  grade: { type: String, default: '' },
  location: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, default: 'Present' },
  location: { type: String, default: '' },
  bullets: [{ type: String }],
  order: { type: Number, default: 0 },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  tech: [{ type: String }],
  link: { type: String, default: '' },
  github: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const skillCategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  items: [{ type: String }],
  order: { type: Number, default: 0 },
});

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  year: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const resumeSchema = new mongoose.Schema({
  personal: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    website: { type: String, default: '' },
    location: { type: String, default: '' },
    summary: { type: String, default: '' },
  },
  education: [educationSchema],
  experience: [experienceSchema],
  projects: [projectSchema],
  skills: [skillCategorySchema],
  achievements: [achievementSchema],
  sectionOrder: {
    type: [String],
    default: ['education', 'experience', 'projects', 'skills', 'achievements'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
