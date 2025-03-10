import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { audioContext } from '../lib/utils';
import { MultimodalLiveAPIClientConnection } from '@/lib/gemini/multimodal-live-client';
import { LiveConfig } from '@/types/multimodal-live-types';
import { AudioStreamer } from '@/lib/gemini/audio-streamer';
import VolMeterWorket from '@/lib/worklets/vol-meter';
import { RAGDocument } from '@/lib/rag/rag-service';
import { useTherapySessionStore } from '@/store/use-therapy-session-store';
import { RAGMultimodalLiveClient } from '@/lib/gemini/rag-multimodal-live-client';
import { getPatientSessions } from '@/lib/actions/session.action';

export type ManualKnowledgeEntry = {
  title: string;
  content: string;
  category?: string;
  timestamp?: number;
};

export type UseLiveAPIWithRAGResults = {
  client: RAGMultimodalLiveClient;
  setConfig: (config: LiveConfig) => void;
  config: LiveConfig;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  volume: number;
  isTranscribing: boolean;
  aiTranscription: string;
  isModelTurn: boolean;
  addDocuments: (documents: RAGDocument[]) => Promise<void>;
  addManualEntry: (entry: ManualKnowledgeEntry) => Promise<void>;
  addManualEntries: (entries: ManualKnowledgeEntry[]) => Promise<void>;
  initializeRAG: () => Promise<void>;
  clearRAG: () => Promise<void>;
  knowledgeBaseEntries: Array<RAGDocument>;
};

export function useLiveAPIWithRAG({
  url,
  apiKey,
}: MultimodalLiveAPIClientConnection): UseLiveAPIWithRAGResults {
  const { patient } = useTherapySessionStore();
  const [knowledgeBaseEntries, setKnowledgeBaseEntries] = useState<
    RAGDocument[]
  >([]);

  const client = useMemo(
    () => new RAGMultimodalLiveClient({ url, apiKey }),
    [url, apiKey]
  );

  const audioStreamerRef = useRef<AudioStreamer | null>(null);
  const [connected, setConnected] = useState(false);
  const [config, setConfig] = useState<LiveConfig>({
    model: 'models/gemini-2.0-flash-exp',
  });
  const [volume, setVolume] = useState(0);
  const [aiTranscription, setAiTranscription] = useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isModelTurn, setIsModelTurn] = useState(true);

  // Register audio for streaming server -> speakers
  useEffect(() => {
    if (!audioStreamerRef.current) {
      audioContext({ id: 'audio-out' }).then((audioCtx: AudioContext) => {
        audioStreamerRef.current = new AudioStreamer(audioCtx);
        audioStreamerRef.current
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .addWorklet<any>('vumeter-out', VolMeterWorket, (ev: any) => {
            setVolume(ev.data.volume);
          })
          .then(() => {
            // Successfully added worklet
          });
      });
    }
  }, [audioStreamerRef]);

  useEffect(() => {
    const onClose = () => {
      setConnected(false);
    };
    const stopAudioStreamer = () => audioStreamerRef.current?.stop();
    const onAudio = (data: ArrayBuffer) =>
      audioStreamerRef.current?.addPCM16(new Uint8Array(data));
    const onAiTranscription = (text: string) => {
      setAiTranscription(text);
    };
    const onTranscribe = (isTranscribing: boolean) => {
      setIsTranscribing(isTranscribing);
    };
    const onModelTurn = (isModelTurn: boolean) => {
      setIsModelTurn(isModelTurn);
    };

    client
      .on('close', onClose)
      .on('interrupted', stopAudioStreamer)
      .on('audio', onAudio)
      .on('isTranscribing', onTranscribe)
      .on('aiTranscription', onAiTranscription)
      .on('isModelTurn', onModelTurn);

    return () => {
      client
        .off('close', onClose)
        .off('interrupted', stopAudioStreamer)
        .off('audio', onAudio)
        .off('isTranscribing', onTranscribe)
        .off('aiTranscription', onAiTranscription)
        .off('isModelTurn', onModelTurn);
    };
  }, [client]);

  const connect = useCallback(async () => {
    if (!config) {
      throw new Error('config has not been set');
    }

    const sessionsResult = await getPatientSessions({
      id: patient?._id as string,
    });

    let sessions = sessionsResult.data;

    // Sort sessions by date in descending order (most recent first)
    sessions =
      sessions &&
      sessions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3); // Keep only the latest three sessions

    // Format past sessions for the prompt
    const pastSessionsText =
      sessions && sessions.length > 0
        ? sessions
            .map((session) => {
              const sessionNotes = session.patientNotes
                ? `Therapist's Notes: ${session.patientNotes}`
                : '';

              const conversationHistory = session.conversationHistory
                .map(
                  (entry) =>
                    `[${new Date(entry.timestamp).toLocaleString()}] : ${entry.content}`
                )
                .join('\n');

              return `Session on ${new Date(session.date).toLocaleString()}:\n${sessionNotes}\n${conversationHistory}`;
            })
            .join('\n\n')
        : 'No previous session data available.';

    // Include the most recent therapist notes separately if available
    const latestTherapistNotes = sessions?.[0]?.patientNotes
      ? `Most recent therapist's notes: ${sessions[0].patientNotes}`
      : '';

    const UPDATED_PROMPT = `You are now a digital twin of ${patient?.name}, created based on transcribed therapy sessions.
      Patient background:
      - Name: ${patient?.name}
      - Conditions: ${patient?.conditions?.join(', ') || 'Unknown'}
      - Therapy history: ${sessions?.length || 0} recent sessions
      Based on the following therapy session notes and transcriptions, embody the patient's communication style, thought patterns, concerns, and progress:
      
      ${pastSessionsText}
  
      ${latestTherapistNotes}
  
      When responding to questions or scenarios, maintain the authentic voice and psychological profile of the patient. Reflect their current mental state, coping mechanisms, and therapeutic progress.
      If asked about topics not covered in the therapy sessions, respond in a way that's consistent with what's known about the patient, but indicate uncertainty where appropriate. Just say Hi initially, with a short intro of your problem`;

    console.log(UPDATED_PROMPT);

    client.disconnect();
    await client.connect(config);
    setAiTranscription('');
    client.send([{ text: UPDATED_PROMPT }]);
    setConnected(true);
  }, [client, setConnected, config]);

  const disconnect = useCallback(async () => {
    client.disconnect();
    setConnected(false);
  }, [setConnected, client]);

  const addDocuments = useCallback(
    async (documents: RAGDocument[]) => {
      await client.addDocuments(documents);
      setKnowledgeBaseEntries((prev) => [...prev, ...documents]);
    },
    [client]
  );

  /**
   * Add a manual entry to the knowledge base
   */
  const addManualEntry = useCallback(
    async (entry: ManualKnowledgeEntry) => {
      const document: RAGDocument = {
        content: entry.content,
        metadata: {
          title: entry.title,
          category: entry.category || 'manual-entry',
          timestamp: entry.timestamp || Date.now(),
          type: 'manual',
        },
      };

      await client.addDocuments([document]);
      setKnowledgeBaseEntries((prev) => [...prev, document]);
      console.log(`Added manual entry: ${entry.title}`);
    },
    [client]
  );

  /**
   * Add multiple manual entries at once
   */
  const addManualEntries = useCallback(
    async (entries: ManualKnowledgeEntry[]) => {
      const documents: RAGDocument[] = entries.map((entry) => ({
        content: entry.content,
        metadata: {
          title: entry.title,
          category: entry.category || 'manual-entry',
          timestamp: entry.timestamp || Date.now(),
          type: 'manual',
        },
      }));

      await client.addDocuments(documents);
      setKnowledgeBaseEntries((prev) => [...prev, ...documents]);
      console.log(`Added ${documents.length} manual entries`);
    },
    [client]
  );

  const initializeRAG = useCallback(async () => {
    await client.initializeRAG();
  }, [client]);

  const clearRAG = useCallback(async () => {
    await client.clearRAG();
    setKnowledgeBaseEntries([]);
  }, [client]);

  return {
    client,
    config,
    setConfig,
    connected,
    connect,
    disconnect,
    volume,
    isTranscribing,
    aiTranscription,
    isModelTurn,
    addDocuments,
    addManualEntry,
    addManualEntries,
    initializeRAG,
    clearRAG,
    knowledgeBaseEntries,
  };
}
