import { Schema, Document, models, model, Types } from 'mongoose';

export interface IPatientTreatment {
  patient: Types.ObjectId;
  treatmentPlan: Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'discontinued';
  progress: number; // Percentage completion
  notes?: string;
}

export interface IPatientTreatmentDoc extends IPatientTreatment, Document {}

const PatientTreatmentSchema = new Schema<IPatientTreatmentDoc>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    treatmentPlan: {
      type: Schema.Types.ObjectId,
      ref: 'TreatmentPlan',
      required: true,
    },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ['active', 'completed', 'discontinued'],
      default: 'active',
      required: true,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      required: true,
    },
    notes: { type: String },
  },
  { timestamps: true }
);

const PatientTreatment =
  models?.PatientTreatment ||
  model<IPatientTreatmentDoc>('PatientTreatment', PatientTreatmentSchema);

export default PatientTreatment;
