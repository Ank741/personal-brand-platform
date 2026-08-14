import { ClientProfile } from '@/types/client';

export const mayaVermaClient: ClientProfile = {
  id: 'maya-verma',
  domain: 'mayaverma.org',
  name: 'Dr. Maya Verma',
  professionalTitle: 'Healthcare Innovation & Leadership',
  headline: 'Pioneering Patient-Centric Health Systems & Ethical Clinical AI',
  subHeadline: 'Advancing clinical workflows, digital health telemetry, and compassionate patient care policy across global healthcare ecosystems.',
  location: 'Boston, MA',
  profileImage: '/clients/maya-verma/profile/maya.jpg',
  shortBio: 'Clinician, researcher, and digital health advocate dedicated to translating medical breakthroughs into accessible care delivery systems.',
  longBio: 'Dr. Maya Verma bridges bedside clinical practice with technology innovation. With a background in clinical informatics and health systems design, Dr. Verma works alongside healthcare providers, clinical researchers, and healthtech pioneers to deploy ethical AI tools and streamline caregiver workflows.',
  storyHeadline: 'Humanizing Clinical Technology & Empowering Caregivers',
  philosophyQuote: 'Technology in medicine is only as transformative as the empathy with which it is designed and the trust it builds at the patient’s bedside.',
  credibilityLabel: 'Clinical Benchmarks & Impact',

  brand: {
    accentColor: '#0d9488', // Emerald Teal
    secondaryColor: '#f0fdfa',
    heroVariant: 'modern',
    aboutVariant: 'modern-narrative',
    expertiseVariant: 'cards-grid',
    achievementsVariant: 'modern-strip',
    portfolioVariant: 'minimal-grid',
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
      description: 'Integrating electronic health telemetry tools into intuitive caregiver interfaces to reduce bedside documentation burden.',
    },
    {
      title: 'Ethical Healthcare AI Implementation',
      description: 'Establishing safety benchmarks and algorithmic fairness standards for diagnostic decision support systems.',
    },
    {
      title: 'Care Delivery & Patient Outcome Design',
      description: 'Designing proactive care protocols that improve remote monitoring engagement and patient quality of life.',
    },
  ],

  achievements: [
    { value: '25+', label: 'Peer-Reviewed Clinical Publications' },
    { value: '100k+', label: 'Patients Impacted by Remote Protocols' },
    { value: '12', label: 'Global Healthcare Fellowships Mentored' },
  ],

  ideas: [
    {
      title: 'Human-Centered AI in Clinical Decision Support',
      summary: 'Why clinician trust and patient safety must lead every diagnostic algorithm rollout in modern health systems.',
      category: 'Digital Health',
      type: 'Research Paper',
      date: 'February 2026',
      url: '#',
    },
    {
      title: 'Reducing Burnout Through Empathetic Workflow Design',
      summary: 'Eliminating administrative friction for bedside nurses and physicians through intentional interface design.',
      category: 'Caregiver Workforce',
      type: 'Perspective',
      date: 'Late 2025',
      url: '#',
    },
  ],

  speaking: [
    {
      title: 'Keynote: The Horizon of Telehealth & Preventive Care',
      description: 'Global HealthTech Innovation Forum — Unpacking remote patient monitoring trends and clinical outcome metrics.',
      location: 'Boston, MA',
      date: 'Spring 2025',
      type: 'Keynote',
    },
  ],

  videos: [
    {
      title: 'Demystifying AI in Modern Clinical Practice',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: '18 mins',
      category: 'Symposium Lecture',
    },
    {
      title: 'Building Inclusive Digital Health Interfaces',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: '32 mins',
      category: 'Panel Discussion',
    },
  ],

  courses: [
    {
      title: 'Foundations of Clinical AI & Data Ethics',
      platform: 'HealthEd Academy',
      description: 'A 6-week primer for medical professionals transitioning into digital health product leadership.',
      url: '#',
    },
  ],

  communities: [
    {
      name: 'Future of Health Leadership Network',
      description: 'A peer coalition of clinicians and healthtech innovators advancing ethical patient care technology.',
      role: 'Founding Member',
      url: '#',
    },
  ],

  portfolio: [
    {
      title: 'Remote Telemetry Care Protocol',
      description: 'Developed remote cardiac monitoring protocol adopted across 5 regional clinical centers.',
      category: 'Clinical Protocol',
      metrics: '42% Lower Readmission Rate',
      url: '#',
    },
  ],

  contact: {
    email: 'dr.maya@fictional-health.org',
    location: 'Boston, MA',
    contactFormEnabled: true,
    officeHours: 'Clinical Advisory Hours Tue & Thu',
  },

  seo: {
    title: 'Dr. Maya Verma | Healthcare Innovation & Leadership',
    description: 'Official site of Dr. Maya Verma — clinician, healthtech advisor, and advocate for ethical patient care.',
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
    courses: true,
    communities: true,
    portfolio: true,
    contact: true,
  },
};
