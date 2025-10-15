'use server';

import handleError from '../handlers/error';
import action from '../handlers/action';

import mongoose from 'mongoose';
import { CreateDTSessionSchema, GetDTSessionSchema } from '../validations';
import DTSession, { IDTSessionDoc } from '@/database/dtsession.model';

export async function createDTSession(
  params: CreateDTSessionParams,
): Promise<ActionResponse<IDTSessionDoc>> {
  const validationResult = await action({
    params,
    schema: CreateDTSessionSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { patientId, date, conversationHistory, risk } = validationResult.params!;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [treatmentSession] = await DTSession.create(
      [{ patientId, date, conversationHistory, risk }],
      {
        session,
      },
    );

    if (!treatmentSession) {
      throw new Error('Failed to create session');
    }

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(treatmentSession)),
    };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getSession(
  params: GetSDTessionParams,
): Promise<ActionResponse<IDTSessionDoc>> {
  const validationResult = await action({
    params,
    schema: GetDTSessionSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { sessionId } = validationResult.params!;

  try {
    const session = await DTSession.findOne({ sessionId });

    if (!session) {
      throw new Error('Session not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(session)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getDTSessions(): Promise<ActionResponse<IDTSessionDoc[]>> {
  try {
    const sessions = await DTSession.find();

    if (!sessions) {
      throw new Error('DTSessions not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(sessions)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
