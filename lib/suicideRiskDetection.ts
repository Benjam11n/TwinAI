import { Risk } from '@/types';
import * as ort from 'onnxruntime-web';

interface ModelConfig {
  max_len: number;
  model_type: string;
  vocab_size: number;
  version: string;
  created_date: string;
}

let session: ort.InferenceSession | null = null;
let vocab: Record<string, number> | null = null;
let config: ModelConfig | null = null;

function getRiskLevel(score: number): string {
  if (score > 0.8) {
    return 'high';
  } else if (score > 0.4) {
    return 'medium';
  }

  return 'low';
}

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

    // Ensure max_length exists
    if (!config || !config.max_len) {
      console.error('Model config missing max_length or max_len property');
      return false;
    }

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

  // Make sure max_len is defined
  const maxLen = config?.max_len || 100; // Fallback to 100 if undefined

  // Tokenize text
  const words = text.toLowerCase().split(/\s+/);
  const indices = words.slice(0, maxLen).map((word) => vocab?.[word] ?? 0);

  while (indices.length < maxLen) {
    indices.push(0);
  }

  // Create tensor
  const inputTensor = new ort.Tensor(
    'int64',
    new BigInt64Array(indices.map((i) => BigInt(i))),
    [1, maxLen]
  );

  const feeds = { input: inputTensor };
  const results = await session?.run(feeds);

  if (!results?.output?.data) {
    throw new Error('Model returned no results');
  }

  const score = results.output.data[0];
  if (typeof score !== 'number') {
    throw new Error('Invalid score type');
  }

  const riskLevel = getRiskLevel(score);

  return {
    score,
    riskLevel: riskLevel,
  };
}
