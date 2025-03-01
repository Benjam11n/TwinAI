import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { audioContext } from '../lib/utils';
import { MultimodalLiveAPIClientConnection } from '@/lib/gemini/multimodal-live-client';
import { LiveConfig } from '@/types/multimodal-live-types';
import { AudioStreamer } from '@/lib/gemini/audio-streamer';
import VolMeterWorket from '@/lib/worklets/vol-meter';
import { RAGDocument } from '@/lib/rag/rag-service';
import { useTherapySessionStore } from '@/store/use-therapy-session-store';
import { RAGMultimodalLiveClient } from '@/lib/gemini/rag-multimodal-live-client';

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
  const { patient, patientNotes, transcription } = useTherapySessionStore();
  const [knowledgeBaseEntries, setKnowledgeBaseEntries] = useState<
    RAGDocument[]
  >([]);

  const INITIAL_PROMPT = `You are now a digital twin of ${patient?.name}, created based on transcribed therapy sessions.
    Patient background:
    - Name: ${patient?.name}
    - Conditions: ${patient?.conditions.join(', ')}
    - Therapy history: ${transcription.length} previous sessions
    Based on the following therapy session notes and transcriptions, embody the patient's communication style, thought patterns, concerns, and progress:
    ${transcription
      .map(
        (entry) =>
          `[${new Date(entry.timestamp).toLocaleString()}] ${entry.content}`
      )
      .join('\n\n')}
    ${patientNotes ? `Therapist's additional notes: ${patientNotes}` : ''}
    When responding to questions or scenarios, maintain the authentic voice and psychological profile of the patient. Reflect their current mental state, coping mechanisms, and therapeutic progress.
    If asked about topics not covered in the therapy sessions, respond in a way that's consistent with what's known about the patient, but indicate uncertainty where appropriate.`;

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
    console.log(config);
    if (!config) {
      throw new Error('config has not been set');
    }

    client.disconnect();
    await client.connect(config);
    setAiTranscription('');
    client.send([{ text: INITIAL_PROMPT }]);
    setConnected(true);
  }, [client, setConnected, config, INITIAL_PROMPT]);

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
