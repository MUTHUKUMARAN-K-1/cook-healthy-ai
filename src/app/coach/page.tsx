// Premium AI Coach Page - Fully Functional with Gemini & ElevenLabs

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, User, Bot, ArrowRight, Loader2 } from 'lucide-react';
import { getWellnessAdvice, createChatMessage } from '@/lib/gemini/wellnessCoach';
import { speakText, stopSpeaking, isElevenLabsAvailable } from '@/lib/elevenlabs/client';
import { ChatMessage } from '@/types';

const quickPrompts = [
  { text: 'Budget meal ideas under $5', icon: '💰' },
  { text: 'High protein vegetarian recipes', icon: '💪' },
  { text: 'Quick 15-minute breakfast', icon: '🌅' },
  { text: 'Healthy snacks for work', icon: '🥗' },
  { text: 'Help with diabetes diet', icon: '🩺' },
  { text: 'Energy boosting foods', icon: '⚡' },
];

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createChatMessage('assistant', `Hi! I'm your AI Wellness Coach 🌿

I can help you with:
• Budget-friendly healthy meal planning
• Nutrition advice for any diet
• Quick recipes for busy schedules
• Managing health conditions through food
• Energy-boosting meal ideas

What would you like to know today?`),
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage = createChatMessage('user', content);
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get AI response from Gemini
      const response = await getWellnessAdvice(content, messages);
      
      const botMessage = createChatMessage('assistant', response);
      setMessages(prev => [...prev, botMessage]);

      // Speak the response if voice is enabled
      if (voiceEnabled && isElevenLabsAvailable()) {
        setIsSpeaking(true);
        await speakText(response);
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = createChatMessage('assistant', 
        "I'm having trouble connecting right now. Please try again in a moment! 🙏"
      );
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const toggleVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        sendMessage(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.start();
    } else {
      alert('Voice input is not supported in this browser');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="p-4 border-b border-[var(--border-light)] bg-[var(--surface-elevated)]">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center shadow-lg">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">AI Wellness Coach</h1>
              <p className="text-xs text-[var(--secondary)] flex items-center gap-1">
                <span className="w-2 h-2 bg-[var(--secondary)] rounded-full animate-pulse" />
                Powered by Gemini AI
              </p>
            </div>
          </div>
          <button
            onClick={toggleVoice}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              voiceEnabled 
                ? 'bg-[var(--secondary)]/10 text-[var(--secondary)]' 
                : 'bg-[var(--surface)] text-[var(--text-muted)]'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' 
                    ? 'bg-[var(--primary)]' 
                    : 'bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA]'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`max-w-[85%] p-4 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-[var(--primary)] text-white rounded-br-md'
                    : 'bg-[var(--surface-elevated)] border border-[var(--border-light)] rounded-bl-md'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-[var(--surface-elevated)] border border-[var(--border-light)] p-4 rounded-2xl rounded-bl-md">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--primary)]" />
                  <span className="text-sm text-[var(--text-muted)]">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-[var(--secondary)]/10 rounded-full">
                <Volume2 className="w-4 h-4 text-[var(--secondary)] animate-pulse" />
                <span className="text-sm text-[var(--secondary)]">Speaking...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Prompts */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs text-[var(--text-muted)] mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt.text}
                  onClick={() => sendMessage(prompt.text)}
                  disabled={isLoading}
                  className="chip text-sm py-2"
                >
                  <span>{prompt.icon}</span>
                  <span>{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-[var(--border-light)] bg-[var(--surface-elevated)]">
        <div className="max-w-2xl mx-auto flex gap-2">
          <button
            onClick={startVoiceInput}
            disabled={isLoading}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
              isListening 
                ? 'bg-[var(--primary)] text-white animate-pulse' 
                : 'bg-[var(--surface)] text-[var(--text-muted)] hover:bg-[var(--surface-elevated)]'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask about healthy eating, recipes, nutrition..."
              className="input pr-4"
              disabled={isLoading}
            />
          </div>
          
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 rounded-2xl btn-primary p-0 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
