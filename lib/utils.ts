'use client';

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

import { ConversationHistoryEntry } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { loadModel, predictRisk } from './suicideRiskDetection';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type GetAudioContextOptions = AudioContextOptions & {
  id?: string;
};

const map: Map<string, AudioContext> = new Map();

export const audioContext: (
  options?: GetAudioContextOptions
) => Promise<AudioContext> = (() => {
  const didInteract = new Promise((res) => {
    window.addEventListener('pointerdown', res, { once: true });
    window.addEventListener('keydown', res, { once: true });
  });

  return async (options?: GetAudioContextOptions) => {
    try {
      const a = new Audio();
      a.src =
        'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      await a.play();
      if (options?.id && map.has(options.id)) {
        const ctx = map.get(options.id);
        if (ctx) {
          return ctx;
        }
      }
      const ctx = new AudioContext(options);
      if (options?.id) {
        map.set(options.id, ctx);
      }
      return ctx;
    } catch (e) {
      console.error(e);

      await didInteract;
      if (options?.id && map.has(options.id)) {
        const ctx = map.get(options.id);
        if (ctx) {
          return ctx;
        }
      }
      const ctx = new AudioContext(options);
      if (options?.id) {
        map.set(options.id, ctx);
      }
      return ctx;
    }
  };
})();

export const blobToJSON = (blob: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const json = JSON.parse(reader.result as string);
        resolve(json);
      } else {
        reject('oops');
      }
    };
    reader.readAsText(blob);
  });

export function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function analyzeConversationRisks(
  history: ConversationHistoryEntry[]
) {
  // Ensure model is loaded
  await loadModel();

  const results = [];
  const twinMessages = history.filter((entry) => entry.role === 'twin');

  // Analyze each twin message
  for (const message of twinMessages) {
    const risk = await predictRisk(message.content);
    results.push({
      message,
      risk,
    });
  }

  // Find highest risk message
  const highestRiskEntry = results.reduce(
    (highest, current) =>
      current.risk.score > highest.risk.score ? current : highest,
    { risk: { score: 0, riskLevel: 'none' } }
  );

  return {
    results,
    highestRisk: highestRiskEntry,
    overallRiskLevel: highestRiskEntry.risk?.riskLevel || 'none',
  };
}
