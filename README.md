# TwinAI: AI-Powered Digital Twins for Mental Health Therapy

## Project Overview

TwinAI is an innovative mental health platform that uses AI-powered digital twins to revolutionize therapy practice, assessment, and treatment planning. By creating virtual representations of patients' psychological states, therapists can simulate interventions, track mood patterns, and develop personalized treatment plans in a safe, controlled environment.

## Key Features

### 1. Dual-Mode Therapy Sessions

- **Live Therapy Mode**: Real-time voice-based therapy sessions with automatic transcription. The therapist speaks with the patient while the system captures and analyzes the conversation, creating a searchable record of the session content.

- **Digital Twin Mode**: Interactive AI simulation of patients that responds naturally to therapist input. Therapists can engage with a virtual representation of their patient through voice conversations, with the digital twin responding appropriately based on the patient's known conditions, history, and psychological profile.

### How The Digital Twin Works

The digital twin feature offers a revolutionary approach to therapy practice and planning:

1. **Voice-Based Interaction**: Speak directly to the digital twin using your device's microphone. The system transcribes your speech in real-time and processes your questions or responses.

2. **Responsive AI Patient**: The digital twin listens and responds verbally through text-to-speech, simulating a realistic patient interaction based on the underlying patient data.

3. **Contextual Understanding**: The twin maintains conversation context, remembering earlier statements and responding appropriately throughout the session.

4. **Condition-Specific Behaviors**: Each twin exhibits behaviors and thought patterns consistent with their assigned conditions (depression, anxiety, PTSD, etc.) for realistic simulation.

5. **Learning Capability**: The digital twin adapts to the therapist's approach, allowing for practice with different therapeutic techniques and observing potential outcomes.

### AI Implementation Details

- **Google Gemini Integration**: TwinAI leverages Google's Gemini API to power the digital twin's conversational abilities. This advanced LLM provides natural, contextually appropriate responses based on patient profiles and therapy contexts.

- **Local RAG Implementation**: The application uses a Retrieval-Augmented Generation (RAG) system implemented locally to enhance responses with specific patient knowledge. This allows the digital twin to reference patient history, preferences, and previous sessions during conversations.

- **Voice Processing Pipeline**: The system captures speech through the browser's audio API, processes it through the Gemini transcription service, and outputs responses using text-to-speech technology for fully voice-based interaction.

## Technical Implementation

### Frontend

- **React & Next.js**: Modern, component-based architecture
- **TypeScript**: Type-safe development for increased reliability
- **TailwindCSS**: Responsive and customizable UI components
- **Shadcn/UI**: Accessible component library for consistent UX

### AI Integration

- **Voice Transcription**: Web Speech API with Google Gemini integration
- **Risk Analysis**: Custom PyTorch model for suicide risk assessment
- **ONNX Runtime**: Browser-based inference for treatment recommendations
- **Retrieval Augmented Generation**: Vector database integration for context-aware responses

### State Management

- **Zustand**: Lightweight state management for session data
- **Context API**: React contexts for feature-specific state requirements
- **Local Storage**: Session persistence for uninterrupted user experience

### Data Visualization

- **Recharts**: Dynamic charts for mood tracking and trend analysis
- **Tailwind Styling**: Color-coded indicators for risk levels and treatment efficacy

## Project Structure

```
├── app/                       # Next.js application routes
├── components/                # Reusable UI components
│   ├── patient-dashboard/     # Dashboard-specific components
│   ├── ui/                    # Base UI components
│   └── ...                    # Other component categories
├── contexts/                  # React context providers
│   ├── LiveAPIContext.tsx     # API integration context
│   ├── LiveTranscriptionContext.tsx  # Voice transcription context
│   └── ...                    # Other contexts
├── lib/                       # Utility functions and services
│   ├── transcription/         # Transcription service
│   ├── utils.ts               # General utilities
│   └── ...                    # Other utilities
├── models/                    # AI model files (ONNX, config)
├── store/                     # State management
│   └── use-therapy-session-store.ts  # Therapy session state
├── types/                     # TypeScript type definitions
└── data/                      # Mock data for MVP demonstration
```

## MVP Implementation Notes

This version represents a Minimum Viable Product (MVP) with certain limitations:

- **Hardcoded Data**: Some patient data and analytics are pre-populated for demonstration purposes
- **Limited AI Integration**: Risk analysis and digital twin capabilities are simplified prototypes
- **Local Processing**: All data is processed locally without external API dependencies for MVP testing

In a production implementation, these components would be enhanced with:

- Secure backend API integration
- HIPAA-compliant data storage
- Expanded AI model training
- Advanced encryption for sensitive patient information

## Important Disclaimer

**Storage Limitations**

TwinAI currently uses Zustand for client-side state management instead of a persistent database:

- All data (patient information, session transcripts, analysis results) is stored temporarily in the browser's memory
- Data does not persist between browser sessions or page refreshes
- Following the suggested usage flow is critical to prevent errors
- Deviating from the recommended navigation path may result in state inconsistencies
- The application is not currently configured for production use with real patient data

This approach was chosen deliberately for the MVP to simplify development and deployment. A production version would implement proper backend services with secure database storage, authentication, and HIPAA-compliant data handling.

**For demonstration purposes only. Do not use with actual patient data.**

## Getting Started

### Prerequisites

- Node.js (v16+)
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

## Setting Up Environment Variables

To use TwinAI's transcription features, you need to set up your environment variables:

1. Copy the example environment file to create your own:

   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and add your Gemini API key to the `GEMINI_API_KEY` variable:

   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Save the file and restart the application if it's already running.

You can obtain a Gemini API key by signing up for Google AI Studio or Google Cloud Platform and enabling the Gemini API.

## Usage

1. Navigate to the main dashboard by clicking on the Explore TwinAI button
2. Select a patient to view their profile
3. Click on the live therapy session to start a session
4. Click on the digital twin session to start a digital twin session with the same patient
5. Explore analysis of your responses and any high risk factors

## Future Roadmap

In future iterations, TwinAI will expand to include:

### Advanced Patient Analytics

- **Mood Analysis**: Track patient mood patterns with visual indicators and trend analysis
- **Risk Assessment**: AI-powered suicide risk detection with severity classification
- **Treatment Effectiveness**: Monitor progress across different intervention types

### Personalized Treatment Planning

- **Condition-Specific Plans**: Recommended interventions based on patient profiles
- **Outcome Prediction**: Visualize potential treatment outcomes before implementation
- **Session Planning**: Structure future sessions based on digital twin simulations

### Enhanced Knowledge Integration

- **Document Upload**: Import and analyze patient records, notes, and documentation
- **Manual Knowledge Entry**: Add critical patient information directly into the system
- **RAG-Based System**: Expanded retrieval-augmented generation for deeper context-aware interactions

### Comprehensive Session Management

- **Voice Transcription**: Enhanced automatic transcription of therapy conversations
- **Session History**: Track and access all historical patient interactions
- **Session Analysis**: Automated insights after each therapeutic encounter

## Data Attribution

The suicide risk analysis model in TwinAI was trained using the "Suicide and Depression Detection" dataset from Kaggle, created by Nikhileswar Komati. This dataset is licensed under [Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/).

Dataset URL: [Suicide Watch Dataset on Kaggle](https://www.kaggle.com/datasets/nikhileswarkomati/suicide-watch)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

_Note: This README describes an MVP implementation with some simulated functionality for demonstration purposes. Full production deployment would require additional development and clinical validation._
