import { z } from 'zod';

export const InterviewerPresetSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  personality: z
    .string()
    .min(10, 'Personality description must be at least 10 characters'),
});

export const TargetRoleSchema = z.object({
  jobTitle: z
    .string()
    .min(1, { message: 'Job Title is required' })
    .max(100, { message: 'Job Title cannot exceed 100 characters' }),
  companyName: z
    .string()
    .max(100, { message: 'Company Name cannot exceed 100 characters' }),
  jobDescription: z
    .string()
    .max(3000, { message: 'Job Description cannot exceed 3000 characters' }),
  interviewerPreset: InterviewerPresetSchema,
});
