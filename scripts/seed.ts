import dotenv from 'dotenv';
import dbConnect from '../lib/mongoose';

import seedTherapists from './therapist.seed';
import seedPatients from './patient.seed';
import seedTreatmentPlans from './treatment-plan.seed';
import seedSessions from './session.seed';

dotenv.config({ path: '.env.local' });

async function seedDatabase() {
  try {
    await dbConnect();
    console.log('Connected to database. Starting seeding process...');

    // Run seeds in sequence to respect dependencies
    console.log('Step 1: Seeding therapists...');
    await seedTherapists();

    console.log('Step 2: Seeding patients...');
    await seedPatients();

    console.log('Step 3: Seeding treatment plans...');
    await seedTreatmentPlans();

    console.log('Step 4: Seeding sessions...');
    await seedSessions();

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
