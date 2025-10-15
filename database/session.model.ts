import { Schema, Document, models, model, Types } from 'mongoose';

export interface ConversationHistoryEntry {
  content: string;
  timestamp: number;
}

export interface ISession {
  patientId: Types.ObjectId;
  date: Date;
  patientNotes: string;
  conversationHistory: ConversationHistoryEntry[];
  mood: number;
}

export interface ISessionDoc extends ISession, Document {}

const ConversationHistoryEntrySchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Number,
      required: true,
      default: () => Date.now(),
    },
  },
  { _id: false },
);

const SessionSchema = new Schema<ISessionDoc>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    patientNotes: {
      type: String,
      default: '',
    },
    conversationHistory: [ConversationHistoryEntrySchema],
    mood: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true },
);

SessionSchema.index({ patientId: 1, date: -1 });

const Session = models?.Session || model<ISessionDoc>('Session', SessionSchema);

export default Session;
