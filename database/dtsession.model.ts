import { Schema, Document, models, model, Types } from 'mongoose';

export interface DTConversationHistoryEntry {
  role: 'twin' | 'therapist';
  content: string;
  timestamp: number;
}

export interface IDTSession {
  patientId: Types.ObjectId;
  date: Date;
  conversationHistory: DTConversationHistoryEntry[];
  risk: number;
}

export interface IDTSessionDoc extends IDTSession, Document {}

const ConversationHistoryEntrySchema = new Schema(
  {
    role: {
      type: String,
      enum: ['twin', 'therapist'],
      required: true,
    },
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

const DTSessionSchema = new Schema<IDTSessionDoc>(
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
    conversationHistory: [ConversationHistoryEntrySchema],
    risk: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true },
);

DTSessionSchema.index({ patientId: 1, date: -1 });

const DTSession = models?.DTSession || model<IDTSessionDoc>('DTSession', DTSessionSchema);
export default DTSession;
