import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import { memo, useEffect } from 'react';

function MacadamiaComponent() {
  const { setConfig } = useLiveAPIContext();

  useEffect(() => {
    setConfig({
      model: 'models/gemini-2.0-flash-exp',
      generationConfig: {
        responseModalities: 'audio',
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: 'Aoede',
            },
          },
        },
      },
      systemInstruction: {
        parts: [
          {
            text: `You are an interviewer. Conduct the interview professionally and provide clear audio responses.
            Listen carefully to the candidate's answers and ask relevant follow-up questions.`,
          },
        ],
      },
      tools: [],
    });
  }, [setConfig]);

  return null;
}

export const Macadamia = memo(MacadamiaComponent);
