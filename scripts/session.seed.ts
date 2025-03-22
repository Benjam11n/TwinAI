import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

import Patient, { PatientCondition } from '../database/patient.model';
import Session, { ConversationHistoryEntry } from '../database/session.model';
import dbConnect from '../lib/mongoose';

dotenv.config({ path: '.env.local' });

async function seedSessions() {
  try {
    await dbConnect();

    // Clear existing sessions
    await Session.deleteMany({});
    console.log('Cleared existing sessions');

    // Get all patients
    const patients = await Patient.find().populate('therapistId');

    if (patients.length === 0) {
      throw new Error('No patients found. Please seed patients first.');
    }

    console.log(`Found ${patients.length} patients to create sessions for`);

    // Create an array to hold our session data
    const sessions = [];

    // Generate conversation prompts based on conditions
    interface ConditionPrompts {
      [key: string]: string[];
    }

    const getConditionBasedPrompts = (
      conditions: PatientCondition[]
    ): string[] => {
      const prompts: ConditionPrompts = {
        [PatientCondition.DEPRESSION]: [
          "I've been feeling really low lately, nothing seems to bring me joy.",
          "It's hard to get out of bed most mornings.",
          "I keep thinking about how I've disappointed everyone.",
          "I don't see much point in trying anymore.",
          'Everything feels like too much effort lately.',
        ],
        [PatientCondition.ANXIETY]: [
          "My mind won't stop racing with worries.",
          'I had another panic attack at work yesterday.',
          "I'm constantly on edge waiting for something bad to happen.",
          'Social situations make me feel overwhelmed.',
          'I keep catastrophizing about small problems.',
        ],
        [PatientCondition.PTSD]: [
          'I had that nightmare about the incident again.',
          'Certain sounds still trigger flashbacks.',
          "I've been avoiding places that remind me of what happened.",
          "I feel constantly on guard, like I can't relax.",
          "Sometimes I feel detached, like I'm not really present.",
        ],
        [PatientCondition.STRESS]: [
          'Work pressure is becoming unbearable.',
          "I can't seem to find any time to relax between responsibilities.",
          'My sleep has been affected by all the stress.',
          'I find myself getting irritated by small things.',
          'The constant demands are wearing me down.',
        ],
        [PatientCondition.OTHER]: [
          "I've been struggling with my relationship lately.",
          "I'm having trouble focusing on tasks.",
          'Sometimes I feel like no one understands me.',
          "I've been questioning my life choices a lot.",
          'I need some guidance on setting boundaries.',
        ],
      };

      // Get prompts for the patient's conditions
      let relevantPrompts: string[] = [];
      conditions.forEach((condition) => {
        if (prompts[condition]) {
          relevantPrompts = [...relevantPrompts, ...prompts[condition]];
        }
      });

      // If no matching conditions found, use OTHER
      if (relevantPrompts.length === 0) {
        relevantPrompts = prompts[PatientCondition.OTHER];
      }

      return relevantPrompts;
    };

    // Generate therapist responses
    const therapistResponses = [
      'I understand this is difficult. Can you tell me more about when these feelings started?',
      'Thank you for sharing that. How have you been coping with these feelings?',
      'That sounds challenging. Have you noticed any patterns or triggers?',
      "I'm hearing that this has been really hard for you. What support systems do you have in place?",
      "Let's explore some strategies that might help you manage these situations.",
      'How have these feelings been affecting your daily life?',
      'What would feel like progress to you right now?',
      'Have you tried any coping mechanisms that have worked in the past?',
      "It's important to acknowledge these feelings. Let's work through this together.",
      "I'm curious about how these experiences connect to what we discussed last time.",
    ];

    // Generate between 2-4 sessions for each patient
    for (const patient of patients) {
      const numSessions = faker.number.int({ min: 2, max: 4 });

      // Get condition-based prompts for this patient
      const patientPrompts = getConditionBasedPrompts(patient.conditions);

      // Generate sessions for this patient
      for (let i = 0; i < numSessions; i++) {
        // Create dates for sessions - more recent sessions for more recent indexes
        const sessionDate = faker.date.recent({ days: 90 - i * 15 });

        // Generate conversation history with 3-7 exchanges
        const numExchanges = faker.number.int({ min: 3, max: 7 });
        const conversationHistory: ConversationHistoryEntry[] = [];

        // Current timestamp to build conversation (working backwards from session date)
        let timestamp = sessionDate.getTime();

        // Each exchange is patient -> therapist
        for (let j = 0; j < numExchanges; j++) {
          // Patient message
          const patientMessage = faker.helpers.arrayElement(patientPrompts);
          conversationHistory.push({
            content: patientMessage,
            timestamp: timestamp,
          });

          // Advance time by 1-3 minutes for therapist response
          timestamp += faker.number.int({ min: 60000, max: 180000 });

          // Therapist response
          const therapistResponse =
            faker.helpers.arrayElement(therapistResponses);
          conversationHistory.push({
            content: therapistResponse,
            timestamp: timestamp,
          });

          // Advance time by 1-3 minutes for next patient message
          timestamp += faker.number.int({ min: 60000, max: 180000 });
        }

        // Generate mood score based on patient conditions
        // Patients with depression or PTSD tend to have lower mood scores
        let moodModifier = 0;
        if (patient.conditions.includes(PatientCondition.DEPRESSION)) {
          moodModifier -= 20;
        }
        if (patient.conditions.includes(PatientCondition.PTSD)) {
          moodModifier -= 15;
        }
        if (patient.conditions.includes(PatientCondition.ANXIETY)) {
          moodModifier -= 10;
        }

        // Base mood is 40-80, modified by conditions, clamped to 0-100
        const baseMood = faker.number.int({ min: 40, max: 80 });
        const mood = Math.max(0, Math.min(100, baseMood + moodModifier));

        // Generate patient notes (sometimes empty)
        let patientNotes = '';
        if (faker.number.int({ min: 1, max: 10 }) > 3) {
          patientNotes = faker.helpers.arrayElement([
            'Patient showed improvement in mood from last session.',
            'Patient reported difficulty sleeping this week.',
            'Patient engaged well with homework exercises.',
            'Patient expressed concerns about medication side effects.',
            'Patient discussed family conflict as a significant stressor.',
            'Patient demonstrated progress in using coping strategies.',
            'Patient seemed reluctant to discuss certain topics today.',
            'Patient reported successful use of mindfulness techniques.',
            'Patient missed scheduled activities from treatment plan.',
            'Patient showed signs of increased anxiety when discussing work.',
          ]);
        }

        // Create session object
        sessions.push({
          patientId: patient._id,
          date: sessionDate,
          patientNotes,
          conversationHistory,
          mood,
        });
      }
    }

    // Insert sessions
    const createdSessions = await Session.insertMany(sessions);
    console.log(`Successfully seeded ${createdSessions.length} sessions`);

    // Count sessions per patient
    const patientSessionCounts: { [key: string]: number } = {};
    createdSessions.forEach((session) => {
      const patientId = session.patientId.toString();
      patientSessionCounts[patientId] =
        (patientSessionCounts[patientId] || 0) + 1;
    });

    console.log('Session distribution per patient (sample):');
    // Show session counts for 5 random patients
    const samplePatients = faker.helpers.arrayElements(patients, 5);
    for (const patient of samplePatients) {
      const count = patientSessionCounts[patient._id.toString()] || 0;
      console.log(`- ${patient.name}: ${count} sessions`);
    }

    // Print a sample session
    console.log('Sample session:');
    console.log(JSON.stringify(createdSessions[0], null, 2));

    return createdSessions;
  } catch (error) {
    console.error('Error seeding sessions:', error);
    throw error;
  }
}

// Run the seed function
seedSessions()
  .then(() => {
    console.log('Session seeding completed');
  })
  .catch((error) => {
    console.error('Session seeding failed:', error);
  });

export default seedSessions;
