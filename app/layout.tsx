import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { LiveAPIProvider } from '@/contexts/LiveAPIContext';
import { Toaster } from 'sonner';
import localFont from 'next/font/local';
import { TranscriptionProvider } from '@/contexts/LiveTranscriptionContext';

export const montserrat = localFont({
  src: './fonts/Montserrat-VariableFont_wght.ttf',
  variable: '--font-montserrat-regular',
});

export const metadata: Metadata = {
  title: 'TwinAI',
  description: 'Advanced therapy training with AI patient digital twins',
  icons: {
    icon: '/images/Logo2.png',
  },
};

const API_KEY = process.env.GEMINI_API_KEY as string;

if (typeof API_KEY !== 'string') {
  throw new Error('set GEMINI_API_KEY in .env.local');
}

const host = 'generativelanguage.googleapis.com';
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${montserrat.variable}
          font-sans
          antialiased
        `}
      >
        <LiveAPIProvider url={uri} apiKey={API_KEY}>
          <TranscriptionProvider apiKey={API_KEY}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </TranscriptionProvider>
        </LiveAPIProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
