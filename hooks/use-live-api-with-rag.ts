import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { audioContext } from '../lib/utils';
import { MultimodalLiveAPIClientConnection } from '@/lib/gemini/multimodal-live-client';
import { LiveConfig } from '@/types/multimodal-live-types';
import { AudioStreamer } from '@/lib/gemini/audio-streamer';
import VolMeterWorket from '@/lib/gemini/worklets/vol-meter';
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
  isInitialized: boolean;
};

export function useLiveAPIWithRAG({
  url,
  apiKey,
}: MultimodalLiveAPIClientConnection): UseLiveAPIWithRAGResults {
  const { patient } = useTherapySessionStore();
  const [knowledgeBaseEntries, setKnowledgeBaseEntries] = useState<
    RAGDocument[]
  >([]);
  const [isInitialized, setIsInitialized] = useState(false);

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

  useEffect(() => {
    if (patient?._id) {
      client.setPatientContext(patient._id as string);
      console.log(
        `Set RAG context for patient: ${patient.name} (${patient._id})`
      );
    }
  }, [patient, client]);

  // Fetch patient-specific knowledge base entries when patient changes
  useEffect(() => {
    if (patient?._id) {
      // Set patient context in RAG client
      client.setPatientContext(patient._id as string);

      // Fetch knowledge base entries for this patient
      const fetchPatientEntries = async () => {
        try {
          // This assumes your RAGMultimodalLiveClient has a method to fetch entries
          const entries = await client.getEntriesForPatient(
            patient._id as string
          );
          setKnowledgeBaseEntries(entries);

          // Also check if RAG is initialized for this patient
          const initStatus = await client.getRAGInitializationStatus(
            patient._id as string
          );
          setIsInitialized(initStatus.initialized);

          console.log(
            `Fetched ${entries.length} knowledge base entries for patient: ${patient.name}`
          );
        } catch (error) {
          console.error('Failed to fetch knowledge base entries:', error);
          // Reset to empty in case of error
          setKnowledgeBaseEntries([]);
          setIsInitialized(false);
        }
      };

      fetchPatientEntries();
    } else {
      // Clear entries when no patient is selected
      setKnowledgeBaseEntries([]);
      setIsInitialized(false);
    }
  }, [patient, client]);

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

    // Set patient context in the RAG client
    if (patient?._id) {
      client.setPatientContext(patient._id as string);
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

    // Add session data to RAG if needed
    if (sessions && sessions.length > 0) {
      try {
        // Convert session data into RAG documents
        const sessionDocuments: RAGDocument[] = sessions.flatMap((session) => {
          const documents: RAGDocument[] = [];

          // Add session notes as a document
          if (session.patientNotes) {
            documents.push({
              content: session.patientNotes,
              metadata: {
                type: 'session-notes',
                sessionId: session._id,
                date: new Date(session.date).toISOString(),
                patientId: patient?._id,
              },
            });
          }

          // Add conversation history entries as separate documents for better retrieval
          if (
            session.conversationHistory &&
            session.conversationHistory.length > 0
          ) {
            session.conversationHistory.forEach((entry) => {
              documents.push({
                content: entry.content,
                metadata: {
                  type: 'conversation-entry',
                  sessionId: session._id,
                  date: new Date(session.date).toISOString(),
                  timestamp: new Date(entry.timestamp).toISOString(),
                  patientId: patient?._id,
                },
              });
            });
          }

          return documents;
        });

        // Add to RAG if there are documents
        if (sessionDocuments.length > 0) {
          await client.addDocuments(sessionDocuments);
          console.log(
            `Added ${sessionDocuments.length} session documents to RAG for patient ${patient?.name}`
          );
        }
      } catch (error) {
        console.error('Failed to add session data to RAG:', error);
      }
    }

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

    // Get additional context from RAG if available
    let ragContext = '';
    try {
      // Query RAG for relevant context using patient's conditions as a query
      const patientConditions = patient?.conditions?.join(', ') || 'therapy';
      ragContext = await client.queryRAG(patientConditions);
      if (ragContext) {
        console.log('Retrieved additional RAG context for patient');
      }
    } catch (error) {
      console.warn('Could not retrieve RAG context:', error);
    }

    const UPDATED_PROMPT = `You are now a digital twin of ${patient?.name}, created based on transcribed therapy sessions.
    Patient background:
    - Name: ${patient?.name}
    - Conditions: ${patient?.conditions?.join(', ') ?? 'Unknown'}
    - Therapy history: ${sessions?.length ?? 0} recent sessions
  
    Based on the following therapy session notes and transcriptions, embody the patient's communication style, thought patterns, concerns, and progress:
    
    ${pastSessionsText}
  
    ${latestTherapistNotes}
  
    ${ragContext ? `Additional relevant context from patient history:\n${ragContext}` : ''}
  
    When responding to questions or scenarios, maintain the authentic voice and psychological profile of the patient. Reflect their current mental state, coping mechanisms, and therapeutic progress.
    If asked about topics not covered in the therapy sessions, respond in a way that's consistent with what's known about the patient, but indicate uncertainty where appropriate. Just say Hi initially, with a short intro of your problem`;

    client.disconnect();
    await client.connect(config);
    setAiTranscription('');
    client.send([{ text: UPDATED_PROMPT }]);
    setConnected(true);
  }, [client, setConnected, config, patient]);

  const disconnect = useCallback(async () => {
    client.disconnect();
    setConnected(false);
  }, [setConnected, client]);

  const addDocuments = useCallback(
    async (documents: RAGDocument[]) => {
      if (!patient?._id) {
        console.error('Cannot add documents: No patient selected');
        return;
      }

      // Add patient ID to all documents
      const docsWithPatientId = documents.map((doc) => ({
        ...doc,
        metadata: {
          ...doc.metadata,
          patientId: patient._id,
        },
      }));

      await client.addDocuments(docsWithPatientId);
      setKnowledgeBaseEntries((prev) => [...prev, ...docsWithPatientId]);
    },
    [client, patient]
  );

  /**
   * Add a manual entry to the knowledge base
   */
  const addManualEntry = useCallback(
    async (entry: ManualKnowledgeEntry) => {
      if (!patient?._id) {
        console.error('Cannot add manual entry: No patient selected');
        return;
      }

      const document: RAGDocument = {
        content: entry.content,
        metadata: {
          title: entry.title,
          category: entry.category ?? 'manual-entry',
          timestamp: entry.timestamp ?? Date.now(),
          type: 'manual',
          patientId: patient._id,
        },
      };

      await client.addDocuments([document]);
      setKnowledgeBaseEntries((prev) => [...prev, document]);
      console.log(
        `Added manual entry for patient ${patient.name}: ${entry.title}`
      );
    },
    [client, patient]
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
          category: entry.category ?? 'manual-entry',
          timestamp: entry.timestamp ?? Date.now(),
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
    if (!patient?._id) {
      console.error('Cannot initialize RAG: No patient selected');
      return;
    }

    // Only initialize if we have documents
    if (knowledgeBaseEntries.length === 0) {
      console.error('Cannot initialize RAG: No documents available');
      return;
    }

    await client.initializeRAG(knowledgeBaseEntries);
    setIsInitialized(true);
  }, [client, patient, knowledgeBaseEntries]);

  const clearRAG = useCallback(async () => {
    if (!patient?._id) {
      console.error('Cannot clear RAG: No patient selected');
      return;
    }

    await client.clearRAGForPatient(patient._id as string);
    setKnowledgeBaseEntries([]);
    setIsInitialized(false);
  }, [client, patient]);

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
    isInitialized,
  };
}
