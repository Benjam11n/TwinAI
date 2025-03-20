import { Brain } from 'lucide-react';

const Loading = () => {
  const animationRings = [
    { id: 'ring-small', size: 80, delay: 0, duration: 3 },
    { id: 'ring-medium', size: 120, delay: 0.3, duration: 3.5 },
    { id: 'ring-large', size: 160, delay: 0.6, duration: 4 },
  ];

  const dots = [
    { id: 'dot-1', delay: 0 },
    { id: 'dot-2', delay: 0.2 },
    { id: 'dot-3', delay: 0.4 },
  ];

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-background/50 to-background">
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <div className="absolute -inset-12 flex items-center justify-center opacity-30">
            {animationRings.map((ring) => (
              <div
                key={ring.id}
                className="absolute animate-ping rounded-full border-2 border-primary"
                style={{
                  width: `${ring.size}px`,
                  height: `${ring.size}px`,
                  animationDelay: `${ring.delay}s`,
                  animationDuration: `${ring.duration}s`,
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
            {dots.map((dot) => (
              <div
                key={dot.id}
                className="size-2 animate-bounce rounded-full bg-primary"
                style={{ animationDelay: `${dot.delay}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
