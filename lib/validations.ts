import { z } from 'zod';

export const CreateTreatmentPlanSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  suitable: z
    .array(z.string())
    .min(1, { message: 'At least one suitable condition is required.' }),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters long.' }),
  outcomes: z
    .string()
    .min(10, { message: 'Outcomes must be at least 10 characters long.' }),
  sessions: z
    .array(z.string())
    .min(1, { message: 'At least one session is required.' }),
});

export const GetTreatmentPlanSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
});

export const ConversationHistoryEntrySchema = z.object({
  content: z.string().min(1, { message: 'Content is required.' }),
  timestamp: z.number().optional().default(Date.now),
});

export const CreateSessionSchema = z.object({
  patientId: z.string(),
  date: z
    .date()
    .optional()
    .default(() => new Date()),
  patientNotes: z.string().optional().default(''),
  conversationHistory: z
    .array(ConversationHistoryEntrySchema)
    .optional()
    .default([]),
  mood: z
    .number()
    .min(0, { message: 'Mood cannot be negative.' })
    .max(100, { message: 'Mood cannot be more than 100.' }),
});

export const GetSessionSchema = z.object({
  sessionId: z.string().min(1, { message: 'Session Id is required.' }),
});

export const GetPatientSessionSchema = z.object({
  id: z.string().min(1, { message: 'Patient Id is required.' }),
});

export const AccountSchema = z.object({
  therapistId: z.string().min(1, { message: 'Therapist ID is required.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .max(100, { message: 'Password cannot exceed 100 characters.' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter.',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter.',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one special character.',
    })
    .optional(),
  provider: z.string().min(1, { message: 'Provider is required.' }),
  providerAccountId: z
    .string()
    .min(1, { message: 'Provider Account ID is required.' }),
});

export const SignInWithOAuthSchema = z.object({
  provider: z.enum(['google', 'github']),
  providerAccountId: z
    .string()
    .min(1, { message: 'Provider Account ID is required.' }),
  user: z.object({
    name: z.string().min(1, { message: 'Name is required.' }),
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters long.' }),
    email: z
      .string()
      .email({ message: 'Please provide a valid email address.' }),
    image: z.string().url('Invalid image URL').optional(),
  }),
});

export const GetPatientSchema = z.object({
  id: z.string().min(1, { message: 'Patient ID is required.' }),
});

export const DTConversationHistoryEntrySchema = z.object({
  role: z.enum(['twin', 'therapist'], {
    required_error: 'Role must be either "twin" or "therapist".',
  }),
  content: z.string().min(1, { message: 'Content is required.' }),
  timestamp: z.number().optional().default(Date.now),
});

export const CreateDTSessionSchema = z.object({
  patientId: z.string(),
  date: z
    .date()
    .optional()
    .default(() => new Date()),
  patientNotes: z.string().optional().default(''),
  conversationHistory: z
    .array(DTConversationHistoryEntrySchema)
    .optional()
    .default([]),
  risk: z
    .number()
    .min(0, { message: 'Risk cannot be negative.' })
    .max(100, { message: 'Risk cannot be more than 100.' }),
});

export const GetDTSessionSchema = z.object({
  sessionId: z.string().min(1, { message: 'Session Id is required.' }),
});
