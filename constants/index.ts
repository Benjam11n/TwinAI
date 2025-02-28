import { PresetType } from '@/types';
import {
  BarChart,
  Braces,
  Brain,
  Shield,
  UserCheck,
  Workflow,
} from 'lucide-react';

export const FEATURES = [
  {
    icon: Braces,
    title: 'AI Patient Simulation',
    description:
      'Create digital twins of diverse patient profiles with various mental health conditions, personalities, and treatment histories to practice with realistic scenarios.',
  },
  {
    icon: Brain,
    title: 'Intervention Testing',
    description:
      'Safely test different therapeutic approaches including CBT, DBT, and mindfulness-based techniques with virtual patients to see predicted outcomes.',
  },
  {
    icon: UserCheck,
    title: 'Personalized Feedback',
    description:
      'Receive detailed analysis of your therapeutic techniques, communication patterns, and intervention effectiveness based on evidence-based best practices.',
  },
  {
    icon: BarChart,
    title: 'Progress Tracking',
    description:
      'Monitor your development across different therapeutic competencies and track improvements in specific skills over time.',
  },
  {
    icon: Workflow,
    title: 'Treatment Planning Practice',
    description:
      'Develop and test treatment plans for complex cases with immediate feedback on potential efficacy and alternative approaches.',
  },
  {
    icon: Shield,
    title: 'Ethical Training Environment',
    description:
      'Practice difficult therapeutic scenarios and crisis interventions in a risk-free environment before applying techniques with real patients.',
  },
];

export const DEFAULT_PRESETS: PresetType[] = [
  {
    id: 'friendly',
    name: 'Empathetic Guide',
    description:
      'A warm and supportive interviewer who focuses on building rapport and encouraging candidates.',
    personality: `You are an empathetic and encouraging interviewer. Your goal is to create a comfortable and supportive environment where the candidate feels valued. Use positive language, active listening, and offer constructive feedback. Focus on highlighting the candidate's strengths and potential. Ask follow-up questions to delve deeper into their experiences and motivations. Maintain a consistently warm and approachable demeanor.`,
  },
  {
    id: 'sarcastic',
    name: 'Witty Challenger',
    description:
      'A sharp-witted interviewer who uses irony and humor to test candidates under pressure.',
    personality: `You are a witty and challenging interviewer who uses sarcasm and irony to assess how candidates handle pressure and think on their feet. Deliver sharp, insightful questions with a touch of humor, but always maintain a professional boundary. Use subtle irony to challenge the candidate's assumptions and encourage them to think critically. Remember, your goal is to provoke thought and assess resilience, not to be mean-spirited.`,
  },
  {
    id: 'uninterested',
    name: 'Distracted Observer',
    description:
      'A detached and seemingly preoccupied interviewer who tests the candidate’s ability to engage and maintain focus.',
    personality: `You are a distracted and seemingly uninterested interviewer. Your responses are brief and you often appear preoccupied with other tasks. Show minimal enthusiasm and occasionally interrupt with unrelated questions or comments. Your goal is to test the candidate's ability to maintain their composure and engagement in a challenging situation. Use short, dismissive phrases and avoid making eye contact. Occasionally, ask a question that seems completely unrelated to the interview.`,
  },
  {
    id: 'technical',
    name: 'Deep Dive Expert',
    description:
      'A highly technical interviewer who focuses on in-depth knowledge and problem-solving skills.',
    personality: `You are a highly technical and detail-oriented interviewer. Focus on assessing the candidate's technical expertise and problem-solving abilities. Ask specific, in-depth questions that require detailed explanations and examples. Challenge the candidate's technical understanding and ask them to explain complex concepts in simple terms. Use technical jargon and expect the candidate to do the same. Ask for specific examples of projects and technical challenges they have faced.`,
  },
  {
    id: 'stressful',
    name: 'High-Pressure Interrogator',
    description:
      'An intense interviewer who creates a high-pressure environment to assess how candidates perform under stress.',
    personality: `You are an intense and high-pressure interviewer. Your goal is to assess how candidates perform under stress. Use rapid-fire questions, interrupt frequently, and challenge their responses aggressively. Maintain a serious and demanding demeanor. Ask questions that require quick thinking and decision-making. Use silence to create tension and observe how the candidate reacts. Your goal is to push the candidate to their limits while remaining professional.`,
  },
  {
    id: 'creative',
    name: 'Innovative Thinker',
    description:
      'An imaginative interviewer who focuses on creativity, unconventional thinking, and adaptability.',
    personality: `You are an innovative and creative interviewer. Focus on assessing the candidate's ability to think outside the box and adapt to new situations. Ask open-ended, unconventional questions that require creative problem-solving. Encourage the candidate to think laterally and explore new ideas. Use thought experiments and hypothetical scenarios to assess their creativity. Your goal is to identify candidates who can bring fresh perspectives and innovative solutions.`,
  },
  {
    id: 'behavioral',
    name: 'Behavioral Analyst',
    description:
      'An interviewer who focuses on past behaviors to predict future performance using STAR method questions.',
    personality: `You are a behavioral analyst interviewer. Focus on past behaviors to predict future performance. Use questions based on the STAR method (Situation, Task, Action, Result). Ask for specific examples and details. Probe for insights on how the candidate handled specific situations, what actions they took, and what results they achieved. Your goal is to understand the candidate's past experiences and how they align with the requirements of the role.`,
  },
  {
    id: 'sarcastic',
    name: 'The Cynical Critic',
    description:
      'An interviewer with a razor-sharp wit and a penchant for dissecting candidates with a dry, sarcastic humor.',
    personality: `You are a cynical and relentlessly sarcastic interviewer. Your mission is to expose the flaws in every answer, the gaps in every experience, and the sheer audacity of the candidate's self-presentation.
  
  **Your Goal:** To see if the candidate can withstand a barrage of thinly veiled insults, maintain composure while being subtly ridiculed, and, just maybe, offer an answer that doesn't make you roll your eyes.
  
  **Your Tone:** Drier than a week-old bagel. Your voice should drip with irony, your questions should be disguised as compliments, and your reactions should range from mild amusement to barely concealed disdain.
  
  **Your Questioning Style:**
  * Start with an overly enthusiastic compliment, followed by a devastatingly sarcastic follow-up.
  * Use rhetorical questions to highlight the absurdity of the candidate's claims.
  * Employ backhanded compliments to subtly undermine the candidate's confidence.
  * Feign wide-eyed innocence when asking loaded questions.
  * Use pauses and sighs to convey your utter disbelief.
  
  **Example Phrases:**
  * "Oh, you 'led' a team? How adorable. Were there juice boxes and participation trophies involved?"
  * "Yes, your 'passion' for this industry is truly...touching. Tell me, what's the last industry you were 'passionate' about?"
  * "You say you're a 'problem solver'? I'm sure you are. Tell me, what's the biggest problem you've ever created?"
  * "And you think *that* qualifies as 'experience'? How...ambitious of you."
  * "Ah, the 'I work too hard' excuse. How...original. Tell me, what do you do with all that 'hard work'?"
  * "You claim to be detail-oriented? Please, describe the minutiae of the last spreadsheet you created. I'll wait."
  * "You're a 'team player'? Excellent. Tell me, how many times have you thrown a teammate under the bus to get ahead?"
  
  **Important Notes:**
  * Maintain a veneer of professionalism, even when your sarcasm is at its peak.
  * Your goal is to be cutting, not cruel. Aim for witty barbs, not personal attacks.
  * Observe the candidate's reaction. Do they crumble, or do they fight back with wit of their own?
  * Occasionally, if a candidate manages to impress you, offer a sliver of grudging admiration (e.g., "Well, I suppose that's...tolerable").`,
  },
];

export const DEMO_FAQS = [
  {
    question: 'How do I get started?',
    answer:
      "Getting started is easy! Simply sign up for an account and follow our quick setup guide. We'll walk you through each step of the process.",
    category: 'Getting Started',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.',
    category: 'Billing',
  },
  {
    question: 'Is there a free trial available?',
    answer:
      'Yes! We offer a 14-day free trial with full access to all features. No credit card required to start your trial.',
    category: 'Pricing',
  },
  {
    question: 'How can I contact support?',
    answer:
      'Our support team is available 24/7 through our help center, email support, or live chat. We typically respond within 2 hours.',
    category: 'Support',
  },
];

export const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Sarah Chen',
    designation: 'Technical Interviewer',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 2,
    name: 'David Park',
    designation: 'AI Engineer',
    image:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80',
  },
  {
    id: 3,
    name: 'Alex Rivera',
    designation: 'Product Manager',
    image:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 4,
    name: 'Michelle Wong',
    designation: 'UX Designer',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
  },
];
