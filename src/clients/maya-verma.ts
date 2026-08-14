import { ClientProfile } from '@/types/client';

export const mayaVermaClient: ClientProfile = {
  id: 'maya-verma',
  domain: 'mayaverma.org',
  name: 'Dr. Maya Verma',
  professionalTitle: 'Healthcare Innovation & Leadership',
  headline: 'Pioneering Patient-Centric Health Systems & AI Diagnostics',
  subHeadline: 'Advancing clinical workflows, digital health integration, and accessible care policy across global healthcare ecosystems.',
  location: 'Boston, MA',
  profileImage: '/clients/maya-verma/profile/maya.jpg',
  shortBio: 'Clinician, researcher, and digital health advocate dedicated to translating medical breakthroughs into compassionate care systems.',
  longBio: 'Dr. Maya Verma bridges clinical practice with technology innovation. With a background in medical informatics and health systems design, Dr. Verma works alongside clinical teams, startups, and research institutions to deploy ethical AI tools and streamline care delivery.',

  brand: {
    accentColor: '#0d9488', // Emerald Teal
    heroVariant: 'modern',
    aboutVariant: 'centered',
    portfolioVariant: 'grid',
  },

  social: {
    linkedin: 'https://linkedin.com/in/fictional-maya-verma',
    youtube: 'https://youtube.com/@fictional_maya_verma',
    instagram: 'https://instagram.com/fictional_maya_verma',
    email: 'dr.maya@fictional-health.org',
  },

  expertise: [
    {
      title: 'Digital Health & Clinical Informatics',
      description: 'Integrating electronic health records and telemetry tools into intuitive caregiver interfaces.',
    },
    {
      title: 'Ethical Healthcare AI Implementation',
      description: 'Establishing safety benchmarks and algorithmic fairness standards for diagnostic decision support.',
    },
    {
      title: 'Care Delivery & Patient Outcomes',
      description: 'Designing proactive care protocols that reduce hospital readmission rates and improve quality of life.',
    },
  ],

  achievements: [
    { value: '25+', label: 'Peer-Reviewed Clinical Publications' },
    { value: '100k+', label: 'Patients Impacted by Remote Monitoring' },
    { value: '12', label: 'Global Healthcare Fellowships Mentored' },
  ],

  ideas: [
    {
      title: 'Human-Centered AI in Clinical Decision Support',
      summary: 'Why clinician trust and patient safety must lead every diagnostic algorithm rollout.',
      category: 'Digital Health',
      url: '#',
    },
    {
      title: 'Reducing Burnout Through Empathetic Workflow Design',
      summary: 'How modern health systems can eliminate administrative friction for bedside nurses and physicians.',
      category: 'Workforce',
      url: '#',
    },
  ],

  speaking: [
    {
      title: 'Keynote: The Horizon of Telehealth & Preventive Care',
      description: 'Global HealthTech Innovation Forum — Unpacking remote patient monitoring trends.',
    },
  ],

  videos: [
    {
      title: 'Demystifying AI in Modern Medicine',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      title: 'Building Inclusive Digital Health Interfaces',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
  ],

  courses: [
    {
      title: 'Foundations of Clinical AI & Data Ethics',
      platform: 'HealthEd Academy',
      description: 'A 6-week primer for medical professionals transitioning into digital health product roles.',
      url: '#',
    },
  ],

  communities: [
    {
      name: 'Future of Health Leadership Network',
      description: 'A peer coalition of clinicians and healthtech innovators advancing ethical patient care technology.',
      url: '#',
    },
  ],

  portfolio: [
    {
      title: 'Remote Cardiac Monitoring Protocol',
      description: 'Developed telemetry tracking framework adopted across 5 regional clinical centers.',
      url: '#',
    },
  ],

  contact: {
    email: 'dr.maya@fictional-health.org',
    location: 'Boston, MA',
    contactFormEnabled: true,
  },

  seo: {
    title: 'Dr. Maya Verma | Healthcare Innovation & Leadership',
    description: 'Official site of Dr. Maya Verma — clinical innovator, healthtech advisor, and advocate for ethical patient care.',
    keywords: ['Healthcare Innovation', 'Digital Health', 'Clinical AI', 'Patient Care', 'HealthTech'],
    ogImage: '/clients/maya-verma/hero/og-image.png',
  },

  sections: {
    about: true,
    expertise: true,
    achievements: true,
    ideas: true,
    speaking: true,
    videos: true,
    courses: true, // Enabled for Maya
    communities: true, // Enabled for Maya
    portfolio: true,
    contact: true,
  },
};
