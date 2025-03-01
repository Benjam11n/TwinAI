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

- **React & Next.js**: Modern, component-based architecture for building dynamic user interfaces with server-side rendering capabilities, providing improved performance and SEO benefits.
- **TypeScript**: Type-safe development for increased reliability, catching potential errors during development rather than runtime.
- **TailwindCSS**: Responsive and customizable UI components with utility-first approach, enabling rapid prototyping and consistent design implementation.
- **Shadcn/UI**: Accessible component library for consistent UX, built on Radix UI primitives, ensuring ARIA compliance and keyboard navigation support.

### AI Integration

- **Voice Transcription**: Web Speech API with Google Gemini integration for accurate, real-time speech-to-text conversion during therapy sessions.
- **Risk Analysis**: Custom PyTorch LSTM model for suicide risk assessment:
  - **Why LSTM?** Long Short-Term Memory networks were selected because they excel at capturing sequential dependencies in text, making them ideal for analyzing therapy conversations. Unlike simpler models, LSTMs can maintain context across long passages of text, recognizing linguistic patterns that may
  - **Memory Capacity**: The model's ability to "remember" relevant information from earlier in a conversation while forgetting irrelevant details mirrors how human therapists assess risk through dialogue patterns.
  - **Bidirectional Processing**: Implementation includes bidirectional capabilities, allowing the model to analyze text from both directions, improving contextual understanding of suicide risk indicators.
  - **Pre-trained Word Embeddings**: Integration with Word2Vec embeddings provides semantic understanding beyond simple keyword matching, detecting subtle linguistic signals of risk.
- **ONNX Runtime**: Browser-based inference for treatment recommendations enables client-side processing without sending sensitive patient data to external servers, enhancing privacy and reducing latency.
- **Retrieval Augmented Generation**: Vector database integration for context-aware responses, grounding AI outputs in patient-specific information rather than generic responses.

**Statistics for Risk Analysis model**:
Train Loss: 0.0903, Train Acc: 0.9672
Val Loss: 0.1401, Val Acc: 0.9491

### State Management

- **Zustand**: Lightweight state management for session data, chosen for its minimal boilerplate and hooks-based API that integrates seamlessly with React's functional component model.
- **Context API**: React contexts for feature-specific state requirements, providing targeted state access only where needed to avoid unnecessary re-renders.
- **Local Storage**: Session persistence for uninterrupted user experience, allowing temporary data retention without backend dependencies in the MVP phase.

### Data Visualization

- **Recharts**: Dynamic charts for mood tracking and trend analysis, selected for its React integration and declarative API that simplifies creating responsive visualizations.
- **Tailwind Styling**: Color-coded indicators for risk levels and treatment efficacy, providing intuitive visual feedback for therapists.

### Model Training Approach

The suicide risk assessment model was trained using a carefully designed approach:

1. **Dataset Selection**: Utilized the "Suicide and Depression Detection" dataset from Kaggle, containing labeled examples of suicidal and non-suicidal language patterns.
2. **Text Preprocessing**: Implemented tokenization, stopword removal, and sequence standardization to prepare text for the LSTM model.
3. **Word Embeddings**: Incorporated pre-trained Word2Vec embeddings to capture semantic relationships between words, converting text into 300-dimensional vector representations.
4. **Model Architecture**:
   - Embedding layer initialized with pre-trained vectors
   - LSTM layer with 64 hidden units
   - Dense layers with ReLU activation for feature extraction
   - Sigmoid output for binary classification
5. **Optimization**: Trained with Adam optimizer and binary cross-entropy loss, with careful monitoring to prevent overfitting.
6. **ONNX Conversion**: Exported the trained PyTorch model to ONNX format for efficient browser-based inference, enabling client-side risk assessment without server dependencies.

This technical approach prioritizes performance and accuracy— critical factors for mental health applications.

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

## Data Attribution

The suicide risk analysis model in TwinAI was trained using the "Suicide and Depression Detection" dataset from Kaggle, created by Nikhileswar Komati. This dataset is licensed under [Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/).

Dataset URL: [Suicide Watch Dataset on Kaggle](https://www.kaggle.com/datasets/nikhileswarkomati/suicide-watch)
