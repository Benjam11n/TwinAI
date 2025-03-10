'use server';

import handleError from '../handlers/error';
import action from '../handlers/action';

import mongoose from 'mongoose';
import Session, { ISessionDoc } from '@/database/session.model';
import {
  CreateSessionSchema,
  GetPatientSessionSchema,
  GetSessionSchema,
} from '../validations';

export async function createSession(
  params: CreateSessionParams
): Promise<ActionResponse<ISessionDoc>> {
  const validationResult = await action({
    params,
    schema: CreateSessionSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { patientId, date, patientNotes, conversationHistory, mood } =
    validationResult.params!;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [treatmentSession] = await Session.create(
      [{ patientId, date, patientNotes, conversationHistory, mood }],
      {
        session,
      }
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
  params: GetSessionParams
): Promise<ActionResponse<ISessionDoc>> {
  const validationResult = await action({
    params,
    schema: GetSessionSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { sessionId } = validationResult.params!;

  try {
    const session = await Session.findOne({ sessionId });

    if (!session) {
      throw new Error('Session not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(session)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getSessions(): Promise<ActionResponse<ISessionDoc[]>> {
  try {
    const sessions = await Session.find();

    if (!sessions) {
      throw new Error('Sessions not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(sessions)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getPatientSessions(
  params: GetPatientSessionParams
): Promise<ActionResponse<ISessionDoc[]>> {
  const validationResult = await action({
    params,
    schema: GetPatientSessionSchema,
  });

  console.log('test', params);

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { id } = validationResult.params!;

  try {
    const sessions = await Session.find({ patientId: id });

    if (!sessions) {
      throw new Error('Patient sessions not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(sessions)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
