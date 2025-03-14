import { FileText, Check, Eye } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { IPatientDoc, ITreatmentPlanDoc } from '@/database';

export function TreatmentPlansCard({
  patient,
  treatmentPlans,
}: {
  patient: IPatientDoc;
  treatmentPlans: ITreatmentPlanDoc[] | undefined;
}) {
  const recommendedPlans = treatmentPlans?.filter((plan) =>
    plan.suitable.some((condition) => patient.conditions.includes(condition))
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-medium">
          <FileText className="mr-2 size-5 text-muted-foreground" />
          Recommended Treatment Plans
        </CardTitle>
        <CardDescription>
          Personalized plans based on {patient.name}&#39;s condition profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recommendedPlans && recommendedPlans.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {recommendedPlans?.map((plan, index) => (
              <AccordionItem key={plan._id as string} value={String(index)}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="w-full pr-4 text-start">{plan.title}</div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                    <div className="rounded-md bg-muted/30 p-3">
                      <h4 className="mb-2 text-sm font-medium">
                        Key Sessions:
                      </h4>
                      <ul className="space-y-1">
                        {plan.sessions.map((session, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <Check className="mr-2 mt-0.5 size-4 shrink-0 text-green-500" />
                            <span>{session}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2">
                      <h4 className="mb-1 text-sm font-medium">
                        Expected Outcomes:
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {plan.outcomes}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                      <Eye className="mr-2 size-4" />
                      View Details
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-muted-foreground">
              No specific treatment plans found for the patient&apos;s
              conditions.
            </p>
            <Button variant="outline" size="sm" className="mt-4">
              Create Custom Plan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
