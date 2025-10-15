import { Schema, Document, models, model, Types } from 'mongoose';

export enum PatientCondition {
  DEPRESSION = 'Depression',
  ANXIETY = 'Anxiety',
  PTSD = 'PTSD',
  STRESS = 'Stress',
  OTHER = 'Other',
}

export interface IPatient {
  therapistId: Types.ObjectId;
  name: string;
  conditions: PatientCondition[];
}

export interface IPatientDoc extends IPatient, Document {}

const PatientSchema = new Schema<IPatientDoc>(
  {
    therapistId: {
      type: Schema.Types.ObjectId,
      ref: 'Therapist',
      required: true,
    },
    name: { type: String, required: true },
    conditions: [
      {
        type: String,
        enum: Object.values(PatientCondition),
        required: true,
      },
    ],
  },
  { timestamps: true },
);

const Patient = models?.Patient || model<IPatientDoc>('Patient', PatientSchema);

export default Patient;
