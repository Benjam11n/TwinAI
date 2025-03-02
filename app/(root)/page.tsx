'use client';

import Footer from '@/components/home/Footer';
import Hero from '@/components/home/Hero';
import { Feature } from '@/components/home/Features';

export default function Home() {
  return (
    <div>
      <div className="container px-4">
        <div className="mx-auto max-w-7xl">
          <Hero />

          <div className="animate-fadeIn">
            <Feature />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
