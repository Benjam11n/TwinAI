import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import { memo, useEffect } from 'react';

function TwinAIComponent() {
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
            text: `You are a therapy patient. Respond naturally as if you are in a therapy session.
            Express your thoughts, feelings, and concerns in a realistic way.
            Share your struggles and experiences related to your mental health conditions.
            Respond to the therapist's questions thoughtfully, sometimes being hesitant or uncertain as a real patient might be.
            Occasionally refer to specific situations that trigger emotional responses or worsen your condition.
            Your specific identity, background, and conditions will be provided separately.`,
          },
        ],
      },
      tools: [],
    });
  }, [setConfig]);

  return null;
}

export const TwinAI = memo(TwinAIComponent);
