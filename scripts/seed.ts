import Therapist from '@/database/therapist.model';
import Patient, { PatientCondition } from '../database/patient.model';
import dbConnect from '../lib/mongoose';
import { faker } from '@faker-js/faker';

async function seedTherapists() {
  try {
    await dbConnect();

    // Clear existing therapists
    await Therapist.deleteMany({});
    console.log('Cleared existing therapists');

    // Create 3 therapists
    const therapists = [
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@example.com',
        image: faker.image.avatar(),
        bio: 'Clinical psychologist with 10 years of experience specializing in anxiety and depression treatment.',
      },
      {
        name: 'Dr. Michael Chen',
        email: 'michael.chen@example.com',
        image: faker.image.avatar(),
        bio: 'Psychiatrist specializing in PTSD and trauma recovery with an integrative approach to mental health.',
      },
      {
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@example.com',
        image: faker.image.avatar(),
        bio: 'Licensed therapist focusing on stress management and cognitive behavioral techniques.',
      },
    ];

    // Insert therapists
    const createdTherapists = await Therapist.insertMany(therapists);
    console.log(`Successfully seeded ${createdTherapists.length} therapists`);

    // Print the created therapists
    console.log('Created therapists:');
    createdTherapists.forEach((therapist, index) => {
      console.log(`${index + 1}. ${therapist.name} (${therapist.email})`);
    });

    return createdTherapists;
  } catch (error) {
    console.error('Error seeding therapists:', error);
    throw error;
  }
}

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
    const therapistCounts = {};
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

// Run the seed functions
seedTherapists()
  .then(() => {
    console.log('Therapist seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Therapist seeding failed:', error);
    process.exit(1);
  });

seedPatients()
  .then(() => {
    console.log('Database seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database seeding failed:', error);
    process.exit(1);
  });
