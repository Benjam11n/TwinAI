import { Patient } from '@/types';

/**
 * Mock patient data for MVP demonstration purposes.
 *
 * NOTE: This data is hardcoded for the initial MVP version.
 * In a production environment, this would be replaced with:
 * - API calls to a secure patient database
 * - Proper data encryption and HIPAA compliance
 * - Dynamic data loading with proper error handling
 */

export const patients: Patient[] = [
  { name: 'John Doe', conditions: ['Depression', 'Stress', 'Anxiety'] },
  { name: 'Jane Smith', conditions: ['Anxiety', 'Depression'] },
  { name: 'Michael Johnson', conditions: ['PTSD', 'Other'] },
  { name: 'Emily Davis', conditions: ['Stress'] },
  { name: 'Daniel Martinez', conditions: ['Depression'] },
  { name: 'Sophia Brown', conditions: ['PTSD', 'Other'] },
];

export const treatmentPlans = [
  {
    id: 'plan-1',
    title: 'Anxiety Reduction Program',
    suitable: ['Anxiety', 'Stress'],
    description:
      'A structured program focusing on cognitive behavioral techniques to reduce anxiety symptoms.',
    outcomes:
      'Expected 35% reduction in anxiety symptoms and improved coping strategies.',
    sessions: [
      '1. Initial Assessment & Goal Setting',
      '2. Identifying Triggers & Patterns',
      '3. Cognitive Restructuring Techniques',
      '4. Relaxation & Mindfulness Training',
    ],
  },
  {
    id: 'plan-2',
    title: 'Depression Management',
    suitable: ['Depression'],
    description:
      'Comprehensive approach to managing depressive symptoms through behavioral activation and cognitive work.',
    outcomes:
      'Expected improvement in mood, energy levels, and reduced negative thought patterns.',
    sessions: [
      '1. Assessment & Safety Planning',
      '2. Behavioral Activation & Scheduling',
      '3. Negative Thought Identification',
      '4. Cognitive Restructuring',
      '5. Relapse Prevention',
      '6. Progress Review & Future Planning',
    ],
  },
  {
    id: 'plan-3',
    title: 'PTSD Recovery Pathway',
    suitable: ['PTSD'],
    description:
      'Trauma-focused program using evidence-based approaches like CPT and exposure therapy.',
    outcomes:
      'Reduced intrusive thoughts, improved emotional regulation, and decreased hypervigilance.',
    sessions: [
      '1. Trauma Education & Safety',
      '2. Emotional Processing Skills',
      '3-5. Trauma Narrative Work',
      '6-7. Integration & Meaning-Making',
      '8. Maintenance & Moving Forward',
    ],
  },
];

export const recentSessions = [
  {
    id: 'session-1',
    date: 'March 25, 2024',
    type: 'Live Session',
    duration: '48 minutes',
    summary:
      'Discussed recent anxiety triggers and practiced breathing techniques.',
  },
];

export const moodHistory = [
  { date: '2024-03-25', score: 42 },
  { date: '2024-03-18', score: 35 },
  { date: '2024-03-11', score: 28 },
  { date: '2024-03-04', score: 31 },
];
