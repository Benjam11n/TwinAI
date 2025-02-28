/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { audioContext } from '../lib/utils';
import {
  MultimodalLiveAPIClientConnection,
  MultimodalLiveClient,
} from '@/lib/gemini/multimodal-live-client';
import { LiveConfig } from '@/types/multimodal-live-types';
import { AudioStreamer } from '@/lib/gemini/audio-streamer';
import VolMeterWorket from '@/lib/worklets/vol-meter';
import { useInterviewStore } from '@/store/useInterviewStore';
import { EnhancedMultimodalLiveClient } from '@/lib/gemini/enhanced-multimodal-live-client';

export type UseLiveAPIResults = {
  client: MultimodalLiveClient;
  setConfig: (config: LiveConfig) => void;
  config: LiveConfig;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  volume: number;
  isTranscribing: boolean;
  aiTranscription: string;
  isModelTurn: boolean;
};

export function useLiveAPI({
  url,
  apiKey,
}: MultimodalLiveAPIClientConnection): UseLiveAPIResults {
  const { role, resume, preset } = useInterviewStore();

  const INITIAL_PROMPT = `${preset.personality}.
  The user has applied for the role of ${role?.title} at ${role?.company}.
  The job description of this role is ${role?.description}.
  Here's a summary of their resume: ${resume}.
  Given this context, you will conduct an interview.
  You will ask me interview questions one at a time.
  After I answer, reply briefly and ask the next question.
  Please start with the first question.`;

  const client = useMemo(
    () => new EnhancedMultimodalLiveClient({ url, apiKey }),
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
  // register audio for streaming server -> speakers
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
        .on('isTranscribing', onTranscribe)
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
  };
}
