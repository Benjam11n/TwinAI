import { Schema, Document, models, model } from 'mongoose';

export interface IPatient {
  name: string;
  conditions: string[];
  moodHistory?: Array<{
    date: string;
    score: number;
  }>;
}

export interface IPatientDoc extends IPatient, Document {}

const PatientSchema = new Schema<IPatientDoc>(
  {
    name: { type: String, required: true },
    conditions: [{ type: String, required: true }],
    moodHistory: [
      {
        date: { type: String, required: true },
        score: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Patient = models?.Patient || model<IPatientDoc>('Patient', PatientSchema);

export default Patient;
