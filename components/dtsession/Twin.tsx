'use client';

import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Messages from '../chat/Messages';
import { AnimatePresence, motion } from 'framer-motion';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import { TwinAI } from './TwinAI';
import Controls from '../chat/Controls';
import { cn } from '@/lib/utils';
import { useLoggerStore } from '@/store/use-logger-store';
import UserTranscription from './UserTranscription';
import { useTherapySessionStore } from '@/store/use-therapy-session-store';
import { IPatientDoc } from '@/database';

interface TwinProps {
  patient: IPatientDoc;
}

export default function Twin({ patient }: Readonly<TwinProps>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const {
    client,
    connected,
    connect,
    disconnect,
    aiTranscription,
    isModelTurn,
  } = useLiveAPIContext();
  const { conversationHistory, setConversationHistory } =
    useTherapySessionStore();
  const { log } = useLoggerStore();

  useEffect(() => {
    client.on('log', log);
    return () => {
      client.off('log', log);
    };
  }, [client, log]);

  useEffect(() => {
    if (aiTranscription) {
      setConversationHistory([
        ...conversationHistory,
        {
          role: 'twin',
          content: aiTranscription,
          timestamp: Date.now(),
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiTranscription]);

  return (
    <div className="animate-fadeIn mx-auto flex h-[92vh] w-full flex-col">
      <TwinAI />
      <AnimatePresence>
        {!connected ? (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
            >
              <Button
                size="lg"
                className="flex items-center gap-2"
                onClick={connected ? disconnect : connect}
              >
                <Phone className="size-5 opacity-50" />
                <span>Start Session</span>
              </Button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <video
        className={cn(
          'rounded-2xl max-w-xs w-1/5 absolute top-4 right-0 shadow-md',
          {
            hidden: !videoRef.current || !videoStream,
          }
        )}
        ref={videoRef}
        autoPlay
        playsInline
      >
        <track
          kind="captions"
          label="English captions"
          src="/path/to/captions.vtt"
          srcLang="en"
          default
        />
      </video>

      <Messages ref={messagesRef} />
      <UserTranscription isModelTurn={isModelTurn} />

      <Controls
        patient={patient}
        videoRef={videoRef}
        supportsVideo={true}
        onVideoStreamChange={setVideoStream}
      />
    </div>
  );
}
