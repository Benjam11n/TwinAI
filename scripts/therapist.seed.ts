import Therapist from '../database/therapist.model';
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

export default seedTherapists;
