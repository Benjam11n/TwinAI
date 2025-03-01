import Image from 'next/image';
import React from 'react';

export const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div
      className={`flex ${className} items-center justify-center rounded-full`}
    >
      <Image src="/images/Logo2.png" alt="TwinAI Logo" width={40} height={40} />
    </div>
  );
};
