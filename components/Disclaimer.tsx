'use client';

import { useState, useEffect } from 'react';
import { Banner } from '@/components/ui/banner';
import { GITHUB } from '@/constants';

export function Disclaimer() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem('disclaimerDismissed') === 'true';
    if (dismissed) {
      setShow(false);
    }
  }, []);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('disclaimerDismissed', 'true');
  };

  const handleGithubClick = () => {
    window.open(GITHUB, '_blank');
    setShow(false);
    localStorage.setItem('disclaimerDismissed', 'true');
  };

  return (
    <div className="fixed inset-x-0 top-8 z-50 px-24 py-2">
      <Banner
        show={show}
        onHide={handleDismiss}
        title={
          <>
            <span className="font-semibold">⚠️ Hackathon Project:</span>{' '}
            <span className="font-semibold">
              All patient data is fake. DO NOT enter real patient information.
            </span>
          </>
        }
        action={{
          label: 'View on GitHub',
          onClick: handleGithubClick,
        }}
        learnMoreUrl={GITHUB}
      />
    </div>
  );
}
