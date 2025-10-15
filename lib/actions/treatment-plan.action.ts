'use server';

import TreatmentPlan, { ITreatmentPlanDoc } from '@/database/treatment-plan.model';
import handleError from '../handlers/error';
import action from '../handlers/action';
import { CreateTreatmentPlanSchema, GetTreatmentPlanSchema } from '../validations';
import mongoose from 'mongoose';

export async function createTreatmentPlan(
  params: CreateTreatmentPlanParams,
): Promise<ActionResponse<ITreatmentPlanDoc>> {
  const validationResult = await action({
    params,
    schema: CreateTreatmentPlanSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, suitable, description, outcomes, sessions } = validationResult.params!;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [treatmentPlan] = await TreatmentPlan.create(
      [{ title, suitable, description, outcomes, sessions }],
      {
        session,
      },
    );

    if (!treatmentPlan) {
      throw new Error('Failed to create treatment plan');
    }

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(treatmentPlan)),
    };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getTreatmentPlan(
  params: GetTreatmentPlanParams,
): Promise<ActionResponse<ITreatmentPlanDoc>> {
  const validationResult = await action({
    params,
    schema: GetTreatmentPlanSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title } = validationResult.params!;

  try {
    const treatmentPlan = await TreatmentPlan.findOne({ title });

    if (!treatmentPlan) {
      throw new Error('Treatment plan not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(treatmentPlan)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getTreatmentPlans(): Promise<ActionResponse<ITreatmentPlanDoc[]>> {
  try {
    const treatmentPlans = await TreatmentPlan.find();

    if (!treatmentPlans) {
      throw new Error('Treatment Plans not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(treatmentPlans)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
