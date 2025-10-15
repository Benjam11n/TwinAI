import { Schema, Document, models, model } from 'mongoose';
import { PatientCondition } from './patient.model';

export interface ITreatmentPlan {
  title: string;
  suitable: PatientCondition[];
  description: string;
  outcomes: string;
  sessions: string[];
}

export interface ITreatmentPlanDoc extends ITreatmentPlan, Document {}

const TreatmentPlanSchema = new Schema<ITreatmentPlanDoc>(
  {
    title: { type: String, required: true },
    suitable: [
      {
        type: String,
        enum: Object.values(PatientCondition),
        required: true,
      },
    ],
    description: { type: String, required: true },
    outcomes: { type: String, required: true },
    sessions: [{ type: String, required: true }],
  },
  { timestamps: true },
);

const TreatmentPlan =
  models?.TreatmentPlan || model<ITreatmentPlanDoc>('TreatmentPlan', TreatmentPlanSchema);

export default TreatmentPlan;
