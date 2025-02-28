'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DefaultValues, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { InterviewPresets } from '../presets/InterviewPresets';
import { TargetRoleSchema } from '@/lib/validations';
import { useInterviewStore } from '@/store/useInterviewStore';
import { DEFAULT_PRESETS } from '@/constants';
import { useNavigationFlow } from '@/hooks/use-navigation-flow';

type FormData = z.infer<typeof TargetRoleSchema>;

const defaultValues: DefaultValues<FormData> = {
  jobTitle: '',
  companyName: '',
  jobDescription: '',
  interviewerPreset: DEFAULT_PRESETS[0],
};

export default function RoleForm() {
  const { navigateNext } = useNavigationFlow();
  const { setRole, setPreset } = useInterviewStore();

  const form = useForm<FormData>({
    resolver: zodResolver(TargetRoleSchema),
    defaultValues,
  });

  const onSubmit = (data: FormData) => {
    setRole({
      title: data.jobTitle,
      company: data.companyName,
      description: data.jobDescription,
    });
    setPreset(data.interviewerPreset);
    navigateNext();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Target Role Details</h1>
          <p className="text-muted-foreground">
            Enter the details of the position you&apos;re interviewing for
          </p>
        </div>

        <Card className="animate-fadeIn">
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Job Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Software Engineer"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Company Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Acme Corp"
                          className="h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Job Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste the job description here..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interviewerPreset"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Interviewer Style
                      </FormLabel>
                      <FormControl>
                        <InterviewPresets
                          value={field.value.id}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-4 pt-4">
                  <Button
                    type="submit"
                    className="h-12 text-base font-medium"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Start Practice'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
