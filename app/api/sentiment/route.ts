import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { SentimentAnalysisData, SentimentScore } from '@/types';

interface SentimentRequest {
  text: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { text } = (await request.json()) as SentimentRequest;
    if (!text) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Text is required',
          },
          status: 400,
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Call Hugging Face Inference API
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/lxyuan/distilbert-base-multilingual-cased-sentiments-student',
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Format the response
    const result = response.data[0] as SentimentScore[];
    const dominantSentiment = result.reduce(
      (max, current) => (current.score > max.score ? current : max),
      { label: 'neutral', score: -Infinity } as SentimentScore
    );

    const sentimentResult: SentimentAnalysisData = {
      text,
      sentiment: result,
      dominant_sentiment: dominantSentiment.label,
    };

    return NextResponse.json(
      {
        success: true,
        data: sentimentResult,
        status: 200,
      } as SuccessResponse<SentimentAnalysisData>,
      { status: 200 }
    );
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      'Sentiment analysis error:',
      axiosError.response?.data || axiosError.message
    );

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to analyze sentiment',
          details: {
            error: [
              (axiosError.response?.data as string) || axiosError.message,
            ],
          },
        },
        status: 500,
      } as ErrorResponse,
      { status: 500 }
    );
  }
}
