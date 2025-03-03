'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlusCircle, AlertCircle, Check } from 'lucide-react';
import { ManualKnowledgeEntry } from '@/hooks/use-live-api-with-rag';

type ManualKnowledgeEntryFormProps = {
  onEntryAdded: (entry: ManualKnowledgeEntry) => Promise<void>;
  categories?: string[];
};

export function ManualKnowledgeEntryForm({
  onEntryAdded,
  categories = [
    'Patient Information',
    'Medical History',
    'Treatment Notes',
    'Behavioral Observations',
    'Other',
  ],
}: ManualKnowledgeEntryFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!content.trim()) {
      setError('Please enter content');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const entry: ManualKnowledgeEntry = {
        title: title.trim(),
        content: content.trim(),
        category,
        timestamp: Date.now(),
      };

      await onEntryAdded(entry);

      setTitle('');
      setContent('');
      setSuccess('Knowledge base entry added successfully');
    } catch (err) {
      setError(
        `Error adding entry: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Manual Knowledge</CardTitle>
        <CardDescription>
          Add information directly to the digital twin&apos;s knowledge base
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Patient's childhood trauma"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={setCategory}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Enter the information that should be added to the knowledge base..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              disabled={isSubmitting}
              className="resize-none"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert
              variant="default"
              className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            >
              <Check className="size-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            'Adding...'
          ) : (
            <>
              <PlusCircle className="mr-2 size-4" />
              Add to Knowledge Base
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
