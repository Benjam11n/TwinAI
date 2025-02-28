'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FLOW_STEPS, REQUIRED_ORDER } from '@/constants/routes';
import Cookies from 'js-cookie';

export function useNavigationFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  useEffect(() => {
    // Get progress from cookie
    const progress = Cookies.get('navigationProgress');

    try {
      if (progress) {
        const parsedProgress = JSON.parse(progress);
        setCurrentStep(parsedProgress[parsedProgress.length - 1]);
      } else {
        setCurrentStep(FLOW_STEPS.HOME);
        Cookies.set('navigationProgress', JSON.stringify([FLOW_STEPS.HOME]));
      }
    } catch (error) {
      console.error('Error parsing progress:', error);
      setCurrentStep(FLOW_STEPS.HOME);
      Cookies.set('navigationProgress', JSON.stringify([FLOW_STEPS.HOME]));
    }
  }, []);

  const navigateNext = useCallback(() => {
    if (!currentStep) return;

    const currentIndex = REQUIRED_ORDER.indexOf(currentStep);
    if (currentIndex >= 0 && currentIndex < REQUIRED_ORDER.length - 1) {
      const nextStep = REQUIRED_ORDER[currentIndex + 1];
      const newProgress = REQUIRED_ORDER.slice(0, currentIndex + 2);

      Cookies.set('navigationProgress', JSON.stringify(newProgress));
      router.push(nextStep);
    }
  }, [router, currentStep]);

  const retryInterview = useCallback(() => {
    const roleIndex = REQUIRED_ORDER.indexOf(FLOW_STEPS.ROLE);
    const preservedProgress = REQUIRED_ORDER.slice(0, roleIndex + 1);

    Cookies.set('navigationProgress', JSON.stringify(preservedProgress));
    router.push(FLOW_STEPS.CALL);
  }, [router]);

  const resetProgress = useCallback(() => {
    Cookies.set('navigationProgress', JSON.stringify([FLOW_STEPS.HOME]));
    setCurrentStep(FLOW_STEPS.HOME);
    router.push(FLOW_STEPS.HOME);
  }, [router]);

  return {
    navigateNext,
    resetProgress,
    retryInterview,
    currentStep,
    isLoading: currentStep === null,
  };
}
