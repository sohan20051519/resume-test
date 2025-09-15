import { ResumeData, Template } from './types';
import ClassicTemplate from './components/resume/templates/ClassicTemplate';
import ModernTemplate from './components/resume/templates/ModernTemplate';
import MinimalistTemplate from './components/resume/templates/MinimalistTemplate';
import CreativeTemplate from './components/resume/templates/CreativeTemplate';
import TechnicalTemplate from './components/resume/templates/TechnicalTemplate';
import ExecutiveTemplate from './components/resume/templates/ExecutiveTemplate';
import ProfessionalTemplate from './components/resume/templates/ProfessionalTemplate';
import CompactTemplate from './components/resume/templates/CompactTemplate';
import CorporateTemplate from './components/resume/templates/CorporateTemplate';
import MonacoTemplate from './components/resume/templates/MonacoTemplate';
import ChronologicalTemplate from './components/resume/templates/ChronologicalTemplate';
import { Type } from '@google/genai';

export const generateId = () => `id-${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`;

export const DUMMY_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: "Alex Doe",
    jobTitle: "Senior Frontend Developer",
    email: "alex.doe@email.com",
    phone: "123-456-7890",
    address: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexdoe",
    website: "alexdoe.dev",
  },
  summary:
    "Innovative and detail-oriented Senior Frontend Developer with over 8 years of experience building and maintaining responsive and scalable web applications. Proficient in React, TypeScript, and modern JavaScript frameworks. Passionate about creating seamless user experiences and collaborating in agile environments to deliver high-quality software.",
  experience: [
    {
      id: "exp1",
      jobTitle: "Senior Frontend Developer",
      company: "Tech Solutions Inc.",
      location: "San Francisco, CA",
      startDate: "Jan 2020",
      endDate: "Present",
      description: [
        "Led the development of a new customer-facing dashboard using React and TypeScript, resulting in a 25% increase in user engagement.",
        "Mentored junior developers, conducted code reviews, and established best practices for frontend development.",
        "Collaborated with UX/UI designers to translate wireframes into high-quality, pixel-perfect code.",
      ],
    },
    {
      id: "exp2",
      jobTitle: "Frontend Developer",
      company: "Web Innovators",
      location: "Boston, MA",
      startDate: "Jun 2016",
      endDate: "Dec 2019",
      description: [
        "Developed and maintained components for a large-scale e-commerce platform using Angular.",
        "Improved website performance by 40% through code optimization and lazy loading techniques.",
        "Worked closely with backend developers to integrate RESTful APIs.",
      ],
    },
  ],
  education: [
    {
      id: "edu1",
      institution: "University of Technology",
      degree: "B.S. in Computer Science",
      location: "Cambridge, MA",
      startDate: "Sep 2012",
      endDate: "May 2016",
    },
  ],
  skills: [
    { id: 'skill1', name: 'JavaScript (ES6+)' },
    { id: 'skill2', name: 'TypeScript' },
    { id: 'skill3', name: 'React & Redux' },
    { id: 'skill4', name: 'Vue.js' },
    { id: 'skill5', name: 'Node.js' },
    { id: 'skill6', name: 'HTML5 & CSS3' },
    { id: 'skill7', name: 'Tailwind CSS' },
    { id: 'skill8', name: 'GraphQL' },
    { id: 'skill9', name: 'Jest & React Testing Library' },
    { id: 'skill10', name: 'Webpack' },
    { id: 'skill11', name: 'Git & GitHub' },
    { id: 'skill12', name: 'Agile Methodologies' }
  ],
  projects: [],
  certifications: [],
  languages: [],
};

export const TEMPLATES: Template[] = [
    {
        id: 'classic',
        name: 'Classic Professional',
        component: ClassicTemplate,
        thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=565&fit=crop&q=80',
    },
    {
        id: 'modern',
        name: 'Modern Two-Column',
        component: ModernTemplate,
        thumbnail: 'https://images.unsplash.com/photo-1598772433939-95330366606a?w=400&h=565&fit=crop&q=80',
    },
     {
        id: 'compact',
        name: 'Compact',
        component: CompactTemplate,
        thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=565&fit=crop&q=80',
    },
    {
        id: 'minimalist',
        name: 'Simple Minimalist',
        component: MinimalistTemplate,
        thumbnail: 'https://images.unsplash.com/photo-1517547109322-1d5a7101897a?w=400&h=565&fit=crop&q=80',
    },
    {
        id: 'creative',
        name: 'Creative',
        component: CreativeTemplate,
        thumbnail: 'https://images.unsplash.com/photo-1557835234-197c3365d752?w=400&h=565&fit=crop&q=80',
    },
    {
        id: 'professional',
        name: 'Professional',
        component: ProfessionalTemplate,
        thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=565&fit=crop&q=80',
    },
    {
        id: 'technical',
        name: 'Technical',
        component: TechnicalTemplate,
        thumbnail: 'https://images.unsplash.com/photo-1620325867582-51b2275b2521?w=400&h=565&fit=crop&q=80',
    },
    {
        id: 'executive',
        name: 'Executive',
        component: ExecutiveTemplate,
        thumbnail: 'https://images.unsplash.com/photo-1496115933010-9c97b8b78862?w=400&h=565&fit=crop&q=80',
    },
    {
        id: 'corporate',
        name: 'Corporate',
        component: CorporateTemplate,
        thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=565&fit=crop&q=80',
    },
    {
        id: 'monaco',
        name: 'Monaco',
        component: MonacoTemplate,
        thumbnail: 'https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?w=400&h=565&fit=crop&q=80',
    },
    {
        id: 'chronological',
        name: 'Chronological',
        component: ChronologicalTemplate,
        thumbnail: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=400&h=565&fit=crop&q=80',
    },
];

// Defines the expected JSON structure for the AI model
export const resumeSchema = {
    type: Type.OBJECT,
    properties: {
        personalInfo: {
            type: Type.OBJECT,
            properties: {
                fullName: { type: Type.STRING, description: "Full name of the person." },
                jobTitle: { type: Type.STRING, description: "Most recent or desired job title." },
                email: { type: Type.STRING, description: "Email address." },
                phone: { type: Type.STRING, description: "Phone number." },
                address: { type: Type.STRING, description: "City and State, e.g., 'San Francisco, CA'." },
                linkedin: { type: Type.STRING, description: "URL of LinkedIn profile." },
                website: { type: Type.STRING, description: "URL of personal website or portfolio." },
            },
        },
        summary: { type: Type.STRING, description: "The professional summary or objective section." },
        experience: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    jobTitle: { type: Type.STRING },
                    company: { type: Type.STRING },
                    location: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    description: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of responsibilities and achievements as bullet points." },
                },
            },
        },
        education: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    institution: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    location: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                },
            },
        },
        skills: {
            type: Type.ARRAY,
            description: "List of skills.",
            items: {
                type: Type.OBJECT, properties: { name: { type: Type.STRING } }
            },
        },
        projects: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    link: { type: Type.STRING },
                    description: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of project details as bullet points." },
                },
            },
        },
        certifications: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    organization: { type: Type.STRING },
                    date: { type: Type.STRING },
                },
            },
        },
        languages: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    proficiency: { type: Type.STRING },
                },
            },
        },
    },
};