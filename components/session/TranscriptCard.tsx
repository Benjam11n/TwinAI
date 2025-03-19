'use client';

import { Card } from '@/components/ui/card';
import { ConversationHistoryEntry } from '@/database';

interface TranscriptCardProps {
  transcripts: ConversationHistoryEntry[];
}

export default function TranscriptCard({ transcripts }: TranscriptCardProps) {
  return (
    <Card className="mb-6 p-6">
      <h2 className="mb-4 text-xl font-semibold">Transcription</h2>
      <div className="max-h-80 overflow-y-auto rounded-lg border bg-muted/30 p-4">
        {transcripts && transcripts.length > 0 ? (
          <div className="space-y-4">
            {transcripts.map((transcript) => (
              <div
                key={transcript.timestamp}
                className="border-b border-gray-200 pb-3 last:border-0"
              >
                <div className="mb-1 flex items-start justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(transcript.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p>{transcript.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-muted-foreground">
            No transcription available for this session.
          </p>
        )}
      </div>
    </Card>
  );
}
