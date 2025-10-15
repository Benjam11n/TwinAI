import { Badge } from '@/components/ui/badge';
import { FEATURES } from '@/constants';

function Feature() {
  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col items-start gap-4">
            <div>
              <Badge>WE STAND OUT</Badge>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="max-w-xl text-left text-3xl font-semibold tracking-tighter md:text-5xl">
                AI-Powered training for therapists
              </h2>
              <p className="max-w-xl text-left text-lg leading-relaxed tracking-tight text-muted-foreground lg:max-w-lg">
                Master therapeutic techniques through practice with diverse AI patient profiles.
              </p>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <div key={index} className="glass-panel feature-card-hover space-y-4 p-8">
                <div className="flex flex-row items-center gap-2 space-x-2">
                  <div className="rounded-2xl bg-primary/10 p-4">
                    <feature.icon className="size-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold">{feature.title}</h3>
                </div>
                <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };
