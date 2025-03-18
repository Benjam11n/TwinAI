'use client';

import { Brain } from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-background/50 to-background">
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <div className="absolute -inset-12 flex items-center justify-center opacity-30">
            {[...Array(3)].map((_, i) => (
              <div
                key={`ping-animation-${i}`}
                className="absolute animate-ping rounded-full border-2 border-primary"
                style={{
                  width: `${(i + 2) * 40}px`,
                  height: `${(i + 2) * 40}px`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${3 + i * 0.5}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 p-4">
            <Brain className="size-16 animate-pulse text-primary" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold">TwinAI</h2>
          <p className="mt-2 text-muted-foreground">
            Preparing your therapy session
          </p>

          <div className="mt-4 flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="size-2 animate-bounce rounded-full bg-primary"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
