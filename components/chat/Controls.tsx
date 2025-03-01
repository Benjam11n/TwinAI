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

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useLiveAPIContext } from '@/contexts/LiveAPIContext';
import { UseMediaStreamResult } from '@/hooks/use-media-stream-mux';
import { useScreenCapture } from '@/hooks/use-screen-capture';
import { useWebcam } from '@/hooks/use-webcam';
import { AudioRecorder } from '@/lib/gemini/audio-recorder';
import {
  Camera,
  CameraOff,
  LogOut,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, RefObject, useEffect, useRef, useState } from 'react';

interface ControlsProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  children?: ReactNode;
  supportsVideo: boolean;
  onVideoStreamChange?: (stream: MediaStream | null) => void;
}

interface MediaStreamButtonProps {
  isStreaming: boolean;
  type: 'webcam' | 'screen';
  start: () => Promise<void>;
  stop: () => void;
  connected: boolean;
}

/**
 * button used for triggering webcam or screen-capture
 */
const MediaStreamButton = ({
  isStreaming,
  type,
  start,
  stop,
  connected,
}: MediaStreamButtonProps) => {
  const buttonClasses =
    'flex items-center justify-center w-12 h-12 bg-neutral-200 text-neutral-600 rounded-2xl border border-transparent transition-all hover:bg-transparent hover:border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-800';

  return (
    <Button
      size="icon"
      className={buttonClasses}
      onClick={isStreaming ? stop : start}
      disabled={!connected}
    >
      {type === 'webcam' ? (
        isStreaming ? (
          <CameraOff size={24} />
        ) : (
          <Camera size={24} />
        )
      ) : isStreaming ? (
        <MonitorOff size={24} />
      ) : (
        <Monitor size={24} />
      )}
    </Button>
  );
};

export default function Controls({
  videoRef,
  onVideoStreamChange = () => {},
  supportsVideo,
}: ControlsProps) {
  const router = useRouter();
  const videoStreams = [useWebcam(), useScreenCapture()];
  const [activeVideoStream, setActiveVideoStream] =
    useState<MediaStream | null>(null);
  const [webcam, screenCapture] = videoStreams;
  const [inVolume, setInVolume] = useState(0);
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false);
  const renderCanvasRef = useRef<HTMLCanvasElement>(null);
  const connectButtonRef = useRef<HTMLButtonElement>(null);

  const { client, connected, disconnect } = useLiveAPIContext();

  useEffect(() => {
    if (!connected && connectButtonRef.current) {
      connectButtonRef.current.focus();
    }
  }, [connected]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--volume',
      `${Math.max(5, Math.min(inVolume * 200, 8))}px`
    );
  }, [inVolume]);

  useEffect(() => {
    const onData = (base64: string) => {
      client.sendRealtimeInput([
        {
          mimeType: 'audio/pcm;rate=16000',
          data: base64,
        },
      ]);
    };
    if (connected && !muted && audioRecorder) {
      audioRecorder.on('data', onData).on('volume', setInVolume).start();
    } else {
      audioRecorder.stop();
    }
    return () => {
      audioRecorder.off('data', onData).off('volume', setInVolume);
    };
  }, [connected, client, muted, audioRecorder]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = activeVideoStream;
    }

    let timeoutId = -1;

    function sendVideoFrame() {
      const video = videoRef.current;
      const canvas = renderCanvasRef.current;

      if (!video || !canvas) {
        return;
      }

      const ctx = canvas.getContext('2d')!;
      canvas.width = video.videoWidth * 0.25;
      canvas.height = video.videoHeight * 0.25;
      if (canvas.width + canvas.height > 0) {
        if (videoRef.current) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        }
        const base64 = canvas.toDataURL('image/jpeg', 1.0);
        const data = base64.slice(base64.indexOf(',') + 1, Infinity);
        client.sendRealtimeInput([{ mimeType: 'image/jpeg', data }]);
      }
      if (connected) {
        timeoutId = window.setTimeout(sendVideoFrame, 1000 / 0.5);
      }
    }
    if (connected && activeVideoStream !== null) {
      requestAnimationFrame(sendVideoFrame);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [connected, activeVideoStream, client, videoRef]);

  //handler for swapping from one video-stream to the next
  const changeStreams = (next?: UseMediaStreamResult) => async () => {
    if (next) {
      const mediaStream = await next.start();
      setActiveVideoStream(mediaStream);
      onVideoStreamChange(mediaStream);
    } else {
      setActiveVideoStream(null);
      onVideoStreamChange(null);
    }

    videoStreams.filter((msr) => msr !== next).forEach((msr) => msr.stop());
  };

  const handleEndCall = () => {
    disconnect();
    router.push(ROUTES.DTSESSION_ANALYSIS);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 flex justify-center gap-4 border-t bg-background/80 p-4 backdrop-blur-sm">
      <canvas style={{ display: 'none' }} ref={renderCanvasRef} />

      <Button
        size="lg"
        variant={muted ? 'destructive' : 'default'}
        className="size-12 rounded-full"
        onClick={() => setMuted(!muted)}
        disabled={!connected}
      >
        {muted ? (
          <MicOff className="size-5 animate-pulse" />
        ) : (
          <Mic className="size-5" />
        )}
      </Button>
      {supportsVideo && (
        <>
          <MediaStreamButton
            isStreaming={webcam.isStreaming}
            type="webcam"
            start={changeStreams(webcam)}
            stop={changeStreams()}
            connected={connected}
          />
          <MediaStreamButton
            isStreaming={screenCapture.isStreaming}
            type="screen"
            start={changeStreams(screenCapture)}
            stop={changeStreams()}
            connected={connected}
          />
        </>
      )}

      <Button
        size="icon"
        variant="destructive"
        className="size-12 rounded-2xl"
        onClick={handleEndCall}
        disabled={!connected}
      >
        <LogOut className="size-5 animate-pulse" />
      </Button>
    </div>
  );
}
