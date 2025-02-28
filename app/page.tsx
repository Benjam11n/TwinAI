'use client';

import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import { Feature } from '@/components/Features';
import { FeatureImage } from '@/components/FeatureImage';
import { FaqSectionWithCategories } from '@/components/blocks/faq-with-categories';
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
            <FaqSectionWithCategories
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
