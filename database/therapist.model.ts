import { Types, Schema, Document, models, model } from 'mongoose';

export interface ITherapist {
  name: string;
  email: string;
  image?: string;
  bio?: string;
  accountId?: Types.ObjectId;
}

export interface ITherapistDoc extends ITherapist, Document {}

const TherapistSchema = new Schema<ITherapistDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    bio: { type: String },
  },
  { timestamps: true },
);

TherapistSchema.index({ email: 1 });

TherapistSchema.pre('save', function (next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  next();
});

const Therapist = models?.Therapist || model<ITherapistDoc>('Therapist', TherapistSchema);

export default Therapist;
