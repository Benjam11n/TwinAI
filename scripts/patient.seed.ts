import Patient, { PatientCondition } from '../database/patient.model';
import Therapist from '../database/therapist.model';
import dbConnect from '../lib/mongoose';
import { faker } from '@faker-js/faker';

async function seedPatients() {
  try {
    await dbConnect();

    // Clear existing patients
    await Patient.deleteMany({});
    console.log('Cleared existing patients');

    // Get all therapists
    const therapists = await Therapist.find();

    if (therapists.length === 0) {
      throw new Error('No therapists found. Please seed therapists first.');
    }

    console.log(`Found ${therapists.length} therapists to assign patients to`);

    // Create an array to hold our patient data
    const patients = [];

    // Generate between 30-40 patients
    const numPatients = faker.number.int({ min: 30, max: 40 });

    for (let i = 0; i < numPatients; i++) {
      // Generate random number of conditions (1-3)
      const numConditions = faker.number.int({ min: 1, max: 3 });

      // Get random conditions without duplicates
      const patientConditions = faker.helpers.arrayElements(
        Object.values(PatientCondition),
        numConditions
      );

      // Assign to a random therapist
      const assignedTherapist = faker.helpers.arrayElement(therapists);

      // Create the patient object with therapist assignment
      patients.push({
        name: faker.person.fullName(),
        conditions: patientConditions,
        therapistId: assignedTherapist._id,
      });
    }

    // Insert patients
    const createdPatients = await Patient.insertMany(patients);
    console.log(`Successfully seeded ${createdPatients.length} patients`);

    // Count patients per therapist
    const therapistCounts: Record<string, number> = {};
    createdPatients.forEach((patient) => {
      const therapistId = patient.therapistId.toString();
      therapistCounts[therapistId] = (therapistCounts[therapistId] || 0) + 1;
    });

    console.log('Patient distribution per therapist:');
    for (const therapist of therapists) {
      const count = therapistCounts[therapist._id.toString()] || 0;
      console.log(`- ${therapist.name}: ${count} patients`);
    }

    // Print some sample data
    console.log('Sample patient:');
    console.log(JSON.stringify(createdPatients[0], null, 2));

    return createdPatients;
  } catch (error) {
    console.error('Error seeding patients:', error);
    throw error;
  }
}

export default seedPatients;
