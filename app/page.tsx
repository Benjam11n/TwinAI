'use client';

import Footer from '@/components/home/Footer';
import Hero from '@/components/home/Hero';
import { Feature } from '@/components/home/Features';
import { FeatureImage } from '@/components/home/FeatureImage';
import { Faq } from '@/components/home/Faq';
import { DEMO_FAQS } from '@/constants';

export default function Home() {
  return (
    <div>
      <div className="container px-4">
        <div className="mx-auto max-w-7xl">
          <Hero />

          <div className="animate-fadeIn">
            <Feature />
            <FeatureImage />
            <Faq
              title="Frequently Asked Questions"
              description="Find answers to common questions about our services"
              items={DEMO_FAQS}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
