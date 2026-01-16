// AI Wellness Chat with Voice Input & Output

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Zap, Heart, DollarSign, Utensils, Loader2, Volume2, VolumeX, Mic, MicOff, StopCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from '@/types';
import { generateId } from '@/utils';
import { getWellnessAdvice, createChatMessage } from '@/lib/gemini/wellnessCoach';
import { speakText, isElevenLabsAvailable, VOICES } from '@/lib/elevenlabs/client';
import { useVoiceInput } from '@/hooks/useVoiceInput';

const quickActions = [
  { label: 'Budget meals', icon: DollarSign, prompt: "I need budget-friendly healthy meals for ₹1500/week" },
  { label: 'More energy', icon: Zap, prompt: "I'm feeling tired. Suggest energizing meal ideas" },
  { label: 'Heart healthy', icon: Heart, prompt: "Suggest heart-healthy low cholesterol Indian meals" },
  { label: 'Quick recipes', icon: Utensils, prompt: "I need quick healthy recipes under 20 minutes" },
];

export function WellnessChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createChatMessage('assistant', `Hello! 👋 I'm your AI Wellness Coach. I can help you with:

• 🍳 **Healthy meal planning** on any budget
• 💪 **Nutrition advice** for fitness goals  
• ❤️ **Diet tips** for health conditions
• ⚡ **Energy & mood** through food

How can I help you today? You can type or tap the microphone to speak!`),
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Voice Input Hook
  const {
    isListening,
    transcript,
    isSupported: voiceInputSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceInput({
    language: 'en-IN',
    onResult: (finalTranscript) => {
      setInput(finalTranscript);
    },
  });

  useEffect(() => {
    setVoiceSupported(isElevenLabsAvailable());
  }, []);

  // Update input as user speaks
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speakResponse = async (text: string) => {
    if (!voiceOutputEnabled || !voiceSupported) return;
    
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/•/g, '')
      .replace(/\n\n/g, '. ')
      .replace(/\n/g, '. ')
      .slice(0, 500);
    
    setIsSpeaking(true);
    const audio = await speakText(cleanText, VOICES.coach, 'coach');
    currentAudioRef.current = audio;
    
    if (audio) {
      audio.onended = () => setIsSpeaking(false);
    } else {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    currentAudioRef.current?.pause();
    setIsSpeaking(false);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    resetTranscript();
    const userMessage = createChatMessage('user', text);
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getWellnessAdvice(text, messages);
      const assistantMessage = createChatMessage('assistant', response);
      setMessages(prev => [...prev, assistantMessage]);
      speakResponse(response);
    } catch (error) {
      const errorMessage = createChatMessage('assistant', "I'm having trouble connecting. Please try again!");
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
      // Auto-send after stopping if there's a transcript
      if (input.trim()) {
        setTimeout(() => sendMessage(input), 300);
      }
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[700px]">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                  isListening 
                    ? 'bg-gradient-to-br from-red-500 to-rose-600 animate-pulse' 
                    : 'bg-gradient-to-br from-violet-500 to-purple-600'
                }`}>
                  {isListening ? <Mic className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
                </div>
                {isSpeaking && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <Volume2 className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  {isListening ? '🎙️ Listening...' : 'AI Wellness Coach'}
                </h2>
                <p className="text-sm text-gray-500">
                  {isListening ? 'Speak now, I\'m listening!' : 'Gemini AI + ElevenLabs Voice'}
                </p>
              </div>
            </CardTitle>
            
            {/* Voice Controls */}
            <div className="flex items-center gap-2">
              {isSpeaking && (
                <Button variant="ghost" size="sm" onClick={stopSpeaking}>
                  <StopCircle className="w-4 h-4 mr-1" /> Stop
                </Button>
              )}
              {voiceSupported && (
                <Button
                  variant={voiceOutputEnabled ? 'purple' : 'outline'}
                  size="sm"
                  onClick={() => setVoiceOutputEnabled(!voiceOutputEnabled)}
                >
                  {voiceOutputEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="flex-1 overflow-hidden">
        <CardContent className="h-full p-0">
          <div className="h-full overflow-y-auto p-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-500' 
                      : 'bg-gradient-to-br from-violet-500 to-purple-600'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-md'
                      : 'bg-gray-100 dark:bg-slate-800 rounded-bl-md'
                  }`}>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {message.content.split('\n').map((line, i) => (
                        <p key={i} className="mb-2 last:mb-0">{line}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="p-4 rounded-2xl bg-gray-100 dark:bg-slate-800 rounded-bl-md">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Voice Input Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800 rounded-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="font-medium text-red-700 dark:text-red-400">Recording...</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{transcript || 'Say something...'}</span>
              </div>
              <Button variant="destructive" size="sm" onClick={handleVoiceToggle}>
                <StopCircle className="w-4 h-4 mr-1" /> Stop & Send
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
        {quickActions.map((action) => (
          <Button key={action.label} variant="outline" size="sm" className="flex-shrink-0" onClick={() => sendMessage(action.prompt)} disabled={isLoading || isListening}>
            <action.icon className="w-4 h-4 mr-1" />
            {action.label}
          </Button>
        ))}
      </div>

      {/* Input with Voice Button */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-2">
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder={isListening ? "Listening..." : "Type or tap mic to speak..."} 
            className="flex-1" 
            disabled={isLoading || isListening} 
          />
          
          {/* Voice Input Button */}
          {voiceInputSupported && (
            <Button
              type="button"
              variant={isListening ? 'destructive' : 'outline'}
              size="icon"
              onClick={handleVoiceToggle}
              disabled={isLoading}
              className="relative"
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
              {isListening && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              )}
            </Button>
          )}
          
          <Button type="submit" disabled={isLoading || !input.trim() || isListening}>
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}

export default WellnessChat;
