import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { useNavigationFlow } from '@/hooks/use-navigation-flow';
import { ArrowUpRight } from 'lucide-react';

function FeatureImage() {
  const { navigateNext } = useNavigationFlow();

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="flex flex-col-reverse gap-10 lg:flex-row lg:items-center">
          <div className="aspect-video size-full flex-1 rounded-md bg-muted"></div>
          <div className="flex flex-1 flex-col gap-4 pl-0 lg:pl-20">
            <div>
              <Badge>Features</Badge>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-left text-xl font-semibold tracking-tighter md:text-5xl lg:max-w-xl">
                Practice makes perfect interviews
              </h2>
              <p className="max-w-xl text-left text-lg leading-relaxed tracking-tight text-muted-foreground lg:max-w-sm">
                Preparing for job interviews can be stressful and overwhelming.
                Our AI-powered platform provides realistic interview scenarios,
                personalized feedback, and comprehensive analysis to help you
                perfect your responses and land your dream job with confidence.
              </p>
            </div>
            <div className="mt-4">
              <Button
                size="lg"
                className="group relative flex items-center overflow-hidden rounded-full px-8 py-6 text-lg font-medium shadow-lg transition-all duration-300"
                onClick={navigateNext}
              >
                Start Practising
                <span className="ml-2 flex size-6 items-center justify-center rounded-full transition-all duration-300 group-hover:translate-x-1">
                  <ArrowUpRight className="transition-all" size={16} />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { FeatureImage };
