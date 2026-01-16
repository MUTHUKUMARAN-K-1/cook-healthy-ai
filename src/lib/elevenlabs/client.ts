// ElevenLabs Voice AI Client

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Available voices - using natural Indian-accented and warm voices
export const VOICES = {
  // Warm, friendly female voice for wellness coach
  coach: 'EXAVITQu4vr4xnSDxMaL', // Sarah - warm and conversational
  // Clear female voice for recipe instructions
  recipe: 'jBpfuIE2acCO8z3wKNLl', // Gigi - clear and instructive
  // Friendly male voice alternative
  maleCoach: 'TxGEqnHWrfWFTfGW9XjX', // Josh - friendly and casual
  // Professional female
  professional: 'XB0fDUnXU5powFXDhCwa', // Charlotte - professional
};

// Voice settings for different use cases
const VOICE_SETTINGS = {
  coach: {
    stability: 0.5,
    similarity_boost: 0.8,
    style: 0.4,
    use_speaker_boost: true,
  },
  recipe: {
    stability: 0.7,
    similarity_boost: 0.7,
    style: 0.2,
    use_speaker_boost: true,
  },
};

// Check if ElevenLabs is available
export function isElevenLabsAvailable(): boolean {
  return !!ELEVENLABS_API_KEY && ELEVENLABS_API_KEY !== 'your_elevenlabs_api_key_here';
}

// Text to Speech - Convert text to audio
export async function textToSpeech(
  text: string,
  voiceId: string = VOICES.coach,
  voiceType: 'coach' | 'recipe' = 'coach'
): Promise<ArrayBuffer | null> {
  if (!isElevenLabsAvailable()) {
    console.warn('ElevenLabs API key not configured');
    return null;
  }

  try {
    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5', // Fast, high-quality model
          voice_settings: VOICE_SETTINGS[voiceType],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('ElevenLabs API error:', error);
      return null;
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    return null;
  }
}

// Stream text to speech for longer content
export async function streamTextToSpeech(
  text: string,
  voiceId: string = VOICES.coach,
  onChunk: (chunk: Uint8Array) => void
): Promise<void> {
  if (!isElevenLabsAvailable()) {
    console.warn('ElevenLabs API key not configured');
    return;
  }

  try {
    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: VOICE_SETTINGS.coach,
        }),
      }
    );

    if (!response.ok || !response.body) {
      throw new Error('Stream failed');
    }

    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      onChunk(value);
    }
  } catch (error) {
    console.error('ElevenLabs stream error:', error);
  }
}

// Get available voices from the account
export async function getVoices(): Promise<any[]> {
  if (!isElevenLabsAvailable()) return [];

  try {
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: { 'xi-api-key': ELEVENLABS_API_KEY },
    });

    if (!response.ok) return [];
    const data = await response.json();
    return data.voices || [];
  } catch {
    return [];
  }
}

// Generate speech and return as playable audio URL
export async function generateSpeechUrl(
  text: string,
  voiceId?: string,
  voiceType: 'coach' | 'recipe' = 'coach'
): Promise<string | null> {
  const audioBuffer = await textToSpeech(text, voiceId || VOICES[voiceType], voiceType);
  if (!audioBuffer) return null;

  const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
  return URL.createObjectURL(blob);
}

// Play audio from text
let currentAudio: HTMLAudioElement | null = null;

export async function speakText(
  text: string,
  voiceId?: string,
  voiceType: 'coach' | 'recipe' = 'coach'
): Promise<HTMLAudioElement | null> {
  // Stop any currently playing audio
  stopSpeaking();
  
  const url = await generateSpeechUrl(text, voiceId, voiceType);
  if (!url) return null;

  currentAudio = new Audio(url);
  currentAudio.play();
  return currentAudio;
}

// Stop currently playing audio
export function stopSpeaking(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

// Recipe instruction speaker with step-by-step playback
export class RecipeNarrator {
  private audio: HTMLAudioElement | null = null;
  private isPaused: boolean = false;
  private currentStep: number = 0;
  private steps: string[] = [];
  private onStepChange?: (step: number) => void;

  constructor(steps: string[], onStepChange?: (step: number) => void) {
    this.steps = steps;
    this.onStepChange = onStepChange;
  }

  async playStep(stepIndex: number): Promise<void> {
    if (stepIndex >= this.steps.length) return;
    
    this.currentStep = stepIndex;
    this.onStepChange?.(stepIndex);

    const stepText = `Step ${stepIndex + 1}. ${this.steps[stepIndex]}`;
    this.audio = await speakText(stepText, VOICES.recipe, 'recipe');
    
    if (this.audio) {
      this.audio.onended = () => {
        if (!this.isPaused && this.currentStep < this.steps.length - 1) {
          setTimeout(() => this.playStep(this.currentStep + 1), 1000);
        }
      };
    }
  }

  async start(): Promise<void> {
    this.isPaused = false;
    await this.playStep(0);
  }

  pause(): void {
    this.isPaused = true;
    this.audio?.pause();
  }

  resume(): void {
    this.isPaused = false;
    this.audio?.play();
  }

  stop(): void {
    this.isPaused = true;
    this.audio?.pause();
    this.currentStep = 0;
  }

  next(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.audio?.pause();
      this.playStep(this.currentStep + 1);
    }
  }

  previous(): void {
    if (this.currentStep > 0) {
      this.audio?.pause();
      this.playStep(this.currentStep - 1);
    }
  }

  getCurrentStep(): number {
    return this.currentStep;
  }
}

export default {
  textToSpeech,
  streamTextToSpeech,
  generateSpeechUrl,
  speakText,
  stopSpeaking,
  getVoices,
  isElevenLabsAvailable,
  VOICES,
  RecipeNarrator,
};
