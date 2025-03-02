'use server';

import Patient, { IPatientDoc } from '@/database/patient.model';
import handleError from '../handlers/error';
import dbConnect from '../mongoose';
import action from '../handlers/action';
import { GetPatientSchema } from '../validations';

export async function getPatients(): Promise<ActionResponse<IPatientDoc[]>> {
  try {
    await dbConnect();

    const patients = await Patient.find();

    if (!patients || patients.length === 0) {
      throw new Error('Patients not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(patients)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getPatient(
  params: GetPatientParams
): Promise<ActionResponse<IPatientDoc>> {
  const validationResult = await action({
    params,
    schema: GetPatientSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { id } = validationResult.params!;

  try {
    const patient = await Patient.findById(id);

    if (!patient) {
      throw new Error('Patient not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(patient)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
