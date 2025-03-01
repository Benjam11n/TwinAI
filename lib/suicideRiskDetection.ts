/* eslint-disable @typescript-eslint/no-explicit-any */
import { Risk } from '@/types';
import * as ort from 'onnxruntime-web';

// Cache the model and vocab to avoid reloading
let session: ort.InferenceSession | null = null;
let vocab: Record<string, number> | null = null;
let config: any | null = null;

export async function loadModel() {
  if (session && vocab && config) {
    return true;
  }

  try {
    const modelPath = '/models/suicide_detection_model.onnx';
    const vocabResponse = await fetch('/models/pytorch_vocab.json');
    const configResponse = await fetch('/models/model_config.json');

    vocab = await vocabResponse.json();
    config = await configResponse.json();

    session = await ort.InferenceSession.create(modelPath);
    return true;
  } catch (error) {
    console.error('Error loading suicide risk detection model:', error);
    return false;
  }
}

export async function predictRisk(text: string): Promise<Risk> {
  if (!session || !vocab || !config) {
    const loaded = await loadModel();
    if (!loaded) {
      throw new Error('Failed to load risk detection model');
    }
  }

  // Tokenize text
  const words = text.toLowerCase().split(/\s+/);
  const indices = words
    .slice(0, config.max_len)
    .map((word) => (vocab && vocab[word] !== undefined ? vocab[word] : 0));

  while (indices.length < config.max_len) {
    indices.push(0);
  }

  // Create tensor
  const inputTensor = new ort.Tensor(
    'int64',
    new BigInt64Array(indices.map((i) => BigInt(i))),
    [1, config.max_len]
  );
  const feeds = { input: inputTensor };

  const results = await session?.run(feeds);
  const score = results?.output.data[0];

  if (typeof score !== 'number') {
    throw new Error('Invalid score type');
  }

  return {
    score,
    riskLevel: score > 0.7 ? 'high' : score > 0.4 ? 'medium' : 'low',
  };
}
