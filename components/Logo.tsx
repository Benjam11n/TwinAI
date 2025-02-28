import { Nut } from 'lucide-react';
import React from 'react';

export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div
      className={`flex ${className} items-center justify-center rounded-full bg-primary`}
    >
      <Nut className={`text-white`} />
    </div>
  );
};
