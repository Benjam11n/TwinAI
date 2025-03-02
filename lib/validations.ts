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
  role: z.enum(['twin', 'therapist'], {
    required_error: 'Role must be either "twin" or "therapist".',
  }),
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
  patientId: z.string().min(1, { message: 'Patient Id is required.' }),
});
