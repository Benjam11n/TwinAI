'use client';

import { Button } from './ui/button';
import Link from 'next/link';
import { ShinyText } from './ui/shiny-text';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export default function Hero() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handleLoadedData = () => {
        setIsVideoLoaded(true);
      };
      videoElement.addEventListener('loadeddata', handleLoadedData);
      return () => {
        videoElement.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, []);

  return (
    <div className="relative space-y-4 pb-16">
      {/* Background gradient */}
      <div className="absolute -right-24 -top-24 size-96 animate-pulse rounded-full bg-gradient-to-b from-green-100 to-green-300 opacity-40 blur-3xl"></div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col gap-8">
        {/* Main heading and subheading */}
        <div className="animate-fadeIn mt-16 flex flex-col gap-6">
          <h1 className="text-5xl font-semibold text-foreground md:text-6xl lg:text-7xl">
            <ShinyText text="AI-Powered Patient" disabled={false} speed={3} />
            <br className="hidden sm:block" />
            Digital Twins
          </h1>
          <p className="text-xl text-muted-foreground">
            Perfect your therapy skills with virtual patient simulations.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="group relative flex items-center overflow-hidden rounded-full px-8 py-6 text-lg font-medium shadow-lg transition-all duration-300"
              onClick={() => router.push(ROUTES.DASHBOARD)}
            >
              Explore TwinAI
              <span className="arrow-animation ml-2 flex size-6 items-center justify-center rounded-full">
                <ArrowUpRight className="transition-all" size={16} />
              </span>
            </Button>
            <Link
              href="#"
              className="flex items-center px-4 py-2 text-lg font-medium text-green-600 hover:text-green-700"
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* Therapy simulation visualization */}
        <div className="animate-fadeIn light:border-gray-200 mt-10 overflow-hidden rounded-lg border shadow-md">
          <div className="p-4">
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="light:border-gray-100 border-r pr-4">
                <h3 className="mb-2 font-medium">Patient Profile</h3>
                <div className="flex gap-2">
                  <span className="rounded bg-muted-foreground/40 px-2 py-1 text-sm">
                    Depression
                  </span>
                  <span className="rounded bg-muted-foreground/20 px-2 py-1 text-sm">
                    Anxiety
                  </span>
                </div>
              </div>
              <div className="col-span-2">
                <h3 className="mb-2 font-medium">Therapy Session Scenario</h3>
                <div className="light:border-gray-200 rounded-md border p-3">
                  <p>
                    Patient expresses feeling overwhelmed by work
                    responsibilities and reports difficulty sleeping for the
                    past 3 weeks.
                  </p>
                </div>
              </div>
            </div>

            {/* Mock therapy session in progress */}
            <div className="light:border-gray-200 rounded-md border p-4">
              <div className="light:border-gray-100 mb-4 border-b pb-2">
                <div className="flex items-center">
                  <div className="mr-2 size-2 rounded-full bg-primary"></div>
                  <span className="text-sm">Therapy Session Simulation</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Patient:</span> I've been
                    feeling really stressed lately. I can't seem to get a good
                    night's sleep and it's affecting my work...
                  </p>
                </div>
                <div className="rounded-lg bg-primary/30 p-3">
                  <p className="text-sm">
                    <span className="font-medium">You (Therapist):</span> I
                    understand that must be difficult. Could you tell me more
                    about when these sleep issues began and what was happening
                    in your life at that time?
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-gray-300"></div>
                  <div className="size-2 rounded-full bg-gray-300"></div>
                  <div className="size-2 rounded-full bg-gray-300"></div>
                  <span className="text-xs">
                    AI analyzing therapeutic approach
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video demo section */}
        <Card className="mt-10">
          {/* Video player */}
          <div className="relative aspect-video w-full">
            {!isVideoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
              </div>
            )}
            <video
              ref={videoRef}
              className={`size-full object-cover ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setIsVideoLoaded(true)}
            >
              <source src="" type="video/mp4" />
              {/* Fallback message */}
              Your browser does not support the video tag.
            </video>
          </div>
        </Card>
      </div>
    </div>
  );
}
