'use client';
import React from 'react';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import { TEAM_MEMBERS } from '@/constants';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-24">
      <h1 className="mb-8 text-start text-5xl font-semibold">About TwinAI</h1>
      <div className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Our Mission</h2>
        <p className="mb-6 text-lg">
          At TwinAI, we&apos;re revolutionizing how therapists develop and
          refine their clinical skills. Our AI-powered platform enables
          therapists to create digital twins of their patients, providing
          realistic therapy simulations, personalized feedback, and
          evidence-based training to enhance therapeutic effectiveness.
        </p>
        <p className="mb-6 text-lg">
          We believe every mental health professional deserves access to
          advanced practice opportunities without risking patient outcomes. Our
          technology bridges the gap between theoretical knowledge and practical
          therapeutic skills through safe, ethical simulations of diverse
          patient scenarios.
        </p>
      </div>
      <div className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Our Approach</h2>
        <p className="mb-6 text-lg">
          Our patient digital twin technology creates realistic virtual
          representations of diverse mental health profiles. Therapists can
          practice applying different interventions, receive immediate feedback
          on their approach, and develop confidence in handling complex
          therapeutic situations before implementing techniques with real
          patients.
        </p>
      </div>
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Meet Our Team</h2>
        <div className="mb-8 flex justify-start py-24">
          <AnimatedTooltip items={TEAM_MEMBERS} />
        </div>
      </div>
    </div>
  );
}
