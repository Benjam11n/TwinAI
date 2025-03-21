import { PatientCondition } from '../database';
import TreatmentPlan from '../database/treatment-plan.model';
import dbConnect from '../lib/mongoose';

async function seedTreatmentPlans() {
  try {
    await dbConnect();

    // Clear existing treatment plans
    await TreatmentPlan.deleteMany({});
    console.log('Cleared existing treatment plans');

    // Create treatment plans
    const treatmentPlans = [
      {
        title: 'Cognitive Behavioral Therapy (CBT) for Depression',
        suitable: [PatientCondition.DEPRESSION],
        description:
          'A structured, short-term, goal-oriented form of psychotherapy that focuses on identifying and changing negative thought patterns and behaviors. This approach helps patients develop coping strategies for depression symptoms.',
        outcomes:
          'Reduction in depressive symptoms, improved mood regulation, development of healthy coping mechanisms, and prevention of relapse.',
        sessions: [
          'Session 1: Initial assessment and goal setting',
          'Session 2: Identifying negative thought patterns',
          'Session 3: Challenging cognitive distortions',
          'Session 4: Behavioral activation techniques',
          'Session 5: Skill-building for mood regulation',
          'Session 6: Creating a relapse prevention plan',
        ],
      },
      {
        title: 'Exposure Therapy for Anxiety',
        suitable: [PatientCondition.ANXIETY, PatientCondition.PTSD],
        description:
          'A behavioral therapy approach that helps patients gradually confront their fears in a controlled, safe environment. This treatment systematically desensitizes patients to anxiety-provoking stimuli.',
        outcomes:
          'Reduced anxiety responses to triggers, decreased avoidance behaviors, improved daily functioning, and enhanced quality of life.',
        sessions: [
          'Session 1: Assessment and psychoeducation about anxiety',
          'Session 2: Creating an exposure hierarchy',
          'Session 3: Learning relaxation and coping techniques',
          'Session 4: Beginning gradual exposure exercises',
          'Session 5: Advancing through exposure hierarchy',
          'Session 6: Reinforcement and maintenance planning',
        ],
      },
      {
        title: 'Trauma-Focused Cognitive Behavioral Therapy',
        suitable: [PatientCondition.PTSD],
        description:
          'A specialized form of cognitive behavioral therapy specifically designed for individuals who have experienced trauma. It addresses trauma-related difficulties by integrating trauma-sensitive interventions with cognitive behavioral techniques.',
        outcomes:
          'Reduction in PTSD symptoms, processing of traumatic memories, development of adaptive coping strategies, and improved functioning.',
        sessions: [
          'Session 1: Trauma assessment and safety planning',
          'Session 2: Psychoeducation about trauma and its effects',
          'Session 3: Stress management and relaxation skills',
          'Session 4: Cognitive processing of trauma',
          'Session 5: Trauma narrative development',
          'Session 6: In vivo mastery of trauma reminders',
          'Session 7: Conjoint parent-child sessions (if applicable)',
          'Session 8: Enhancing future safety and development',
        ],
      },
      {
        title: 'Mindfulness-Based Stress Reduction',
        suitable: [PatientCondition.STRESS, PatientCondition.ANXIETY],
        description:
          'An evidence-based program that teaches mindfulness meditation and gentle yoga to promote awareness and reduce stress. This approach helps patients develop a new relationship with stressful thoughts and events.',
        outcomes:
          'Decreased stress levels, improved attention and concentration, enhanced emotional regulation, and better quality of life.',
        sessions: [
          'Session 1: Introduction to mindfulness and body scan practice',
          'Session 2: Mindful breathing and dealing with barriers',
          'Session 3: Mindful movement and yoga',
          'Session 4: Stress reactivity and mindful responding',
          'Session 5: Acceptance and skillful action',
          'Session 6: Working with difficult emotions',
          'Session 7: Communication and interpersonal mindfulness',
          'Session 8: Maintaining practice and relapse prevention',
        ],
      },
      {
        title: 'Dialectical Behavior Therapy (DBT) Skills Training',
        suitable: [
          PatientCondition.DEPRESSION,
          PatientCondition.ANXIETY,
          PatientCondition.OTHER,
        ],
        description:
          'A comprehensive cognitive-behavioral treatment that focuses on building four key skill sets: mindfulness, distress tolerance, emotion regulation, and interpersonal effectiveness.',
        outcomes:
          'Improved emotional regulation, enhanced interpersonal relationships, increased distress tolerance, and reduced self-destructive behaviors.',
        sessions: [
          'Session 1: Introduction to DBT and mindfulness skills',
          'Session 2: Advanced mindfulness practice',
          'Session 3: Distress tolerance skills',
          'Session 4: Crisis survival strategies',
          'Session 5: Emotion regulation techniques',
          'Session 6: Identifying and naming emotions',
          'Session 7: Interpersonal effectiveness skills',
          'Session 8: Maintaining balance in relationships',
        ],
      },
      {
        title: 'Integrative Therapy for Co-occurring Conditions',
        suitable: [
          PatientCondition.DEPRESSION,
          PatientCondition.ANXIETY,
          PatientCondition.PTSD,
          PatientCondition.STRESS,
        ],
        description:
          "A flexible, personalized approach that combines multiple therapeutic modalities to address complex or co-occurring mental health conditions. This treatment is tailored to each patient's unique needs and circumstances.",
        outcomes:
          'Comprehensive symptom reduction, improved overall functioning, enhanced self-awareness, and better management of multiple conditions.',
        sessions: [
          'Session 1: Comprehensive assessment and treatment planning',
          'Session 2: Establishing priority areas and initial interventions',
          'Session 3: Primary symptom management techniques',
          'Session 4: Addressing underlying factors and patterns',
          'Session 5: Integration of cognitive and emotional approaches',
          'Session 6: Building resilience and coping strategies',
          'Session 7: Addressing interpersonal dimensions',
          'Session 8: Creating a sustainable wellness plan',
        ],
      },
    ];

    // Insert treatment plans
    const createdTreatmentPlans =
      await TreatmentPlan.insertMany(treatmentPlans);
    console.log(
      `Successfully seeded ${createdTreatmentPlans.length} treatment plans`
    );

    // Print the created treatment plans
    console.log('Created treatment plans:');
    createdTreatmentPlans.forEach((plan, index) => {
      console.log(
        `${index + 1}. ${plan.title} (Suitable for: ${plan.suitable.join(', ')})`
      );
    });

    return createdTreatmentPlans;
  } catch (error) {
    console.error('Error seeding treatment plans:', error);
    throw error;
  }
}

export default seedTreatmentPlans;
