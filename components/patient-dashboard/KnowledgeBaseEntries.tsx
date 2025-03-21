import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function KnowledgeBaseEntries() {
  const { knowledgeBaseEntries, clearRAG, initializeRAG } = useLiveAPIContext();
  const [isClearing, setIsClearing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const entries = knowledgeBaseEntries;

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await clearRAG();
      toast.success('Knowledge base cleared successfully');
    } catch (error) {
      console.error('Error clearing knowledge base:', error);
      toast.error(
        `Failed to clear knowledge base: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setIsClearing(false);
      setDialogOpen(false);
    }
  };

  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      await initializeRAG();
      setIsInitialized(true);
      toast.success('Knowledge base initialized successfully');
    } catch (error) {
      console.error('Error initializing knowledge base:', error);
      toast.error(
        `Failed to initialize knowledge base: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setIsInitializing(false);
    }
  };

  // Group entries by category
  const entriesByCategory: Record<string, typeof entries> = {};
  entries.forEach((entry) => {
    const category = entry.metadata?.category || 'Uncategorized';
    if (!entriesByCategory[category]) {
      entriesByCategory[category] = [];
    }
    entriesByCategory[category].push(entry);
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Knowledge Base Entries</CardTitle>
          <CardDescription>
            {entries.length} entries in the knowledge base
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isClearing || entries.length === 0}
              >
                {isClearing ? 'Clearing...' : 'Clear All'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all knowledge base entries. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            variant={isInitialized ? 'secondary' : 'default'}
            size="sm"
            onClick={handleInitialize}
            disabled={isInitializing || entries.length === 0}
          >
            {isInitializing
              ? 'Initializing...'
              : isInitialized
                ? 'Reindex'
                : 'Initialize'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            No entries in the knowledge base yet
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(entriesByCategory).map(
              ([category, categoryEntries]) => (
                <div key={category} className="space-y-2">
                  <h3 className="text-sm font-medium">{category}</h3>
                  <div className="max-h-56 space-y-2 overflow-y-auto pr-2">
                    {categoryEntries.map((entry, index) => (
                      <div
                        key={index}
                        className="rounded-md border p-3 text-sm"
                      >
                        <div className="mb-1 font-medium">
                          {entry.metadata?.title || `Entry ${index + 1}`}
                        </div>
                        <div className="line-clamp-2 text-muted-foreground">
                          {entry.content}
                        </div>
                        {entry.metadata?.timestamp && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Added:{' '}
                            {new Date(
                              entry.metadata.timestamp
                            ).toLocaleString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
