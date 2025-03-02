'use server';

import Patient, { IPatientDoc } from '@/database/patient.model';
import handleError from '../handlers/error';

export async function getPatients(): Promise<ActionResponse<IPatientDoc[]>> {
  try {
    const patients = await Patient.find();

    if (!patients) {
      throw new Error('Patients not found');
    }

    return { success: true, data: JSON.parse(JSON.stringify(patients)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
