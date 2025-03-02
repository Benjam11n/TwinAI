import { Schema, Document, models, model } from 'mongoose';

export interface ITreatmentPlan {
  title: string;
  suitable: string[];
  description: string;
  outcomes: string;
  sessions: string[];
}

export interface ITreatmentPlanDoc extends ITreatmentPlan, Document {}

const TreatmentPlanSchema = new Schema<ITreatmentPlanDoc>(
  {
    title: { type: String, required: true },
    suitable: [{ type: String, required: true }],
    description: { type: String, required: true },
    outcomes: { type: String, required: true },
    sessions: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const TreatmentPlan =
  models?.TreatmentPlan ||
  model<ITreatmentPlanDoc>('TreatmentPlan', TreatmentPlanSchema);

export default TreatmentPlan;
