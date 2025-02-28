'use client';

import React from 'react';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';
import { TEAM_MEMBERS } from '@/constants';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-24">
      <h1 className="mb-8 text-start text-5xl font-semibold">
        About Macadamia
      </h1>

      <div className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">Our Mission</h2>
        <p className="mb-6 text-lg">
          At Macadamia, we&apos;re revolutionizing how candidates prepare for
          job interviews. Our AI-powered platform provides realistic interview
          simulations, personalized feedback, and expert coaching to help you
          land your dream job.
        </p>
        <p className="mb-6 text-lg">
          We believe everyone deserves access to high-quality interview
          preparation, regardless of their background or resources. Our
          technology bridges the gap between theoretical knowledge and practical
          interview skills.
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
