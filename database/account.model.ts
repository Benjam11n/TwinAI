import { Types, Schema, Document, models, model } from 'mongoose';

export interface IAccount {
  therapistId: Types.ObjectId;
  password?: string;
  provider: string;
  providerAccountId?: string;
}

export interface IAccountDoc extends IAccount, Document {}

const AccountSchema = new Schema<IAccountDoc>(
  {
    therapistId: {
      type: Schema.Types.ObjectId,
      ref: 'Therapist',
      required: true,
    },
    password: { type: String, select: false },
    provider: {
      type: String,
      required: true,
      default: 'credentials',
    },
    providerAccountId: { type: String, required: true },
  },
  { timestamps: true },
);

const Account = models?.Account || model<IAccountDoc>('Account', AccountSchema);

export default Account;
