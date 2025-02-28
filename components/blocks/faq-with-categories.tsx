'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FaqSectionWithCategoriesProps
  extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  items: {
    question: string;
    answer: string;
    category?: string;
  }[];
}

const FaqSectionWithCategories = React.forwardRef<
  HTMLElement,
  FaqSectionWithCategoriesProps
>(({ className, title, description, items, ...props }, ref) => {
  return (
    <section ref={ref} className={cn('py-16 w-full', className)} {...props}>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 space-y-4 text-center">
            <h2 className="text-4xl font-semibold text-foreground">{title}</h2>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>

          {/* FAQ Items */}
          <Accordion type="single" collapsible className="space-y-4">
            {items.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={cn(
                  'mb-4 rounded-xl',
                  'bg-card text-card-foreground',
                  'border border-border/60',
                  'shadow-sm dark:shadow-black/10'
                )}
              >
                <AccordionTrigger
                  className={cn(
                    'px-6 py-4 text-left hover:no-underline',
                    'data-[state=open]:border-b data-[state=open]:border-border/60'
                  )}
                >
                  <div className="flex flex-col gap-2">
                    {item.category && (
                      <Badge
                        variant="secondary"
                        className="w-fit text-xs font-normal"
                      >
                        {item.category}
                      </Badge>
                    )}
                    <h3 className="text-lg font-medium text-foreground group-hover:text-primary">
                      {item.question}
                    </h3>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-4">
                  <p className="leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
});
FaqSectionWithCategories.displayName = 'FaqSectionWithCategories';

export { FaqSectionWithCategories };
