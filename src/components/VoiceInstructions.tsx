// Voice-Enabled Recipe Instructions Component

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Pause, Play, SkipBack, SkipForward, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isElevenLabsAvailable, speakText, VOICES, RecipeNarrator } from '@/lib/elevenlabs/client';

interface VoiceInstructionsProps {
  steps: { step: number; text: string; duration?: number; tips?: string }[];
  recipeName: string;
}

export function VoiceInstructions({ steps, recipeName }: VoiceInstructionsProps) {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSupported, setIsSupported] = useState(false);
  const narratorRef = useRef<RecipeNarrator | null>(null);

  useEffect(() => {
    setIsSupported(isElevenLabsAvailable());
  }, []);

  useEffect(() => {
    if (voiceEnabled) {
      const stepTexts = steps.map(s => s.text);
      narratorRef.current = new RecipeNarrator(stepTexts, setCurrentStep);
    }
    return () => {
      narratorRef.current?.stop();
    };
  }, [voiceEnabled, steps]);

  const toggleVoice = () => {
    if (!voiceEnabled) {
      setVoiceEnabled(true);
      speakText(`Let's cook ${recipeName}! I'll guide you through each step.`, VOICES.recipe, 'recipe');
    } else {
      setVoiceEnabled(false);
      narratorRef.current?.stop();
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (!narratorRef.current) return;
    
    if (isPlaying) {
      narratorRef.current.pause();
      setIsPlaying(false);
    } else {
      if (currentStep === 0 && !narratorRef.current.getCurrentStep()) {
        narratorRef.current.start();
      } else {
        narratorRef.current.resume();
      }
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    narratorRef.current?.next();
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    narratorRef.current?.previous();
    setIsPlaying(true);
  };

  const speakSingleStep = (stepIndex: number) => {
    const step = steps[stepIndex];
    speakText(`Step ${step.step}. ${step.text}`, VOICES.recipe, 'recipe');
    setCurrentStep(stepIndex);
  };

  if (!isSupported) {
    return null; // Don't show voice controls if not available
  }

  return (
    <div className="mb-6">
      {/* Voice Toggle Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-2xl mb-4 flex items-center justify-between ${
          voiceEnabled 
            ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white' 
            : 'bg-gray-100 dark:bg-slate-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            voiceEnabled ? 'bg-white/20' : 'bg-violet-100 dark:bg-violet-900/30'
          }`}>
            {voiceEnabled ? (
              <Volume2 className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            )}
          </div>
          <div>
            <p className={`font-semibold ${voiceEnabled ? 'text-white' : ''}`}>
              {voiceEnabled ? '🔊 Voice Guide Active' : '🎙️ Voice-Guided Cooking'}
            </p>
            <p className={`text-sm ${voiceEnabled ? 'text-white/80' : 'text-gray-500'}`}>
              {voiceEnabled ? 'AI will read each step aloud' : 'Let AI guide you step-by-step'}
            </p>
          </div>
        </div>
        <Button 
          variant={voiceEnabled ? 'secondary' : 'purple'}
          size="sm"
          onClick={toggleVoice}
        >
          {voiceEnabled ? (
            <><VolumeX className="w-4 h-4 mr-1" /> Turn Off</>
          ) : (
            <><Volume2 className="w-4 h-4 mr-1" /> Enable</>
          )}
        </Button>
      </motion.div>

      {/* Voice Player Controls */}
      <AnimatePresence>
        {voiceEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-violet-200 dark:border-violet-800"
          >
            {/* Progress */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                Step {currentStep + 1} of {steps.length}
              </span>
              <div className="flex-1 h-1.5 bg-violet-200 dark:bg-violet-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Step Preview */}
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
              {steps[currentStep]?.text}
            </p>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button
                variant="purple"
                size="lg"
                onClick={handlePlayPause}
                className="w-14 h-14 rounded-full"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Single step play button
export function StepPlayButton({ step, text }: { step: number; text: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(isElevenLabsAvailable());
  }, []);

  const handlePlay = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    const audio = await speakText(`Step ${step}. ${text}`, VOICES.recipe, 'recipe');
    if (audio) {
      audio.onended = () => setIsPlaying(false);
    } else {
      setIsPlaying(false);
    }
  };

  if (!isSupported) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-8 h-8 rounded-full hover:bg-violet-100 dark:hover:bg-violet-900/30"
      onClick={handlePlay}
      disabled={isPlaying}
    >
      {isPlaying ? (
        <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      ) : (
        <Volume2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
      )}
    </Button>
  );
}

export default VoiceInstructions;
