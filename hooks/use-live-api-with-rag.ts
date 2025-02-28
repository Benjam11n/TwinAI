import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { audioContext } from '../lib/utils';
import { MultimodalLiveAPIClientConnection } from '@/lib/gemini/multimodal-live-client';
import { LiveConfig } from '@/types/multimodal-live-types';
import { AudioStreamer } from '@/lib/gemini/audio-streamer';
import VolMeterWorket from '@/lib/worklets/vol-meter';
import { useInterviewStore } from '@/store/useInterviewStore';
import { RAGDocument } from '@/lib/rag/rag-service';
import { RAGMultimodalLiveClient } from '@/lib/gemini/rag-multimodal-live-client';

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
  initializeRAG: () => Promise<void>;
};

export function useLiveAPIWithRAG({
  url,
  apiKey,
}: MultimodalLiveAPIClientConnection): UseLiveAPIWithRAGResults {
  const { role, resume, preset } = useInterviewStore();

  const INITIAL_PROMPT = `${preset.personality}.
    The user has applied for the role of ${role?.title} at ${role?.company}.
    The job description of this role is ${role?.description}.
    Here's a summary of their resume: ${resume}.
    Given this context, you will conduct an interview.
    You will ask me interview questions one at a time.
    After I answer, reply briefly and ask the next question.
    When relevant, refer to information from the documents I've shared with you.
    Please start with the first question.`;

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
    console.log('sending initial prompt', INITIAL_PROMPT);
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
    },
    [client]
  );

  const initializeRAG = useCallback(async () => {
    await client.initializeRAG();
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
    initializeRAG,
  };
}
