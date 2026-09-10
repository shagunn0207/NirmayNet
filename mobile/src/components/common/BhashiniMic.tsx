import React, { useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BhashiniMicProps {
  onSpeechResult?: (text: string) => void;
  sampleText?: string;
  size?: 'normal' | 'large';
  label?: string;
}

export const BhashiniMic: React.FC<BhashiniMicProps> = ({
  onSpeechResult,
  sampleText = 'छाती दुखतेय आणि श्वास घ्यायला त्रास होतोय (Chest pain & breathing issue)',
  size = 'normal',
  label,
}) => {
  const { t, language } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [speechSuccess, setSpeechSuccess] = useState(false);

  const handleMicClick = () => {
    if (isListening) return;

    setIsListening(true);
    setSpeechSuccess(false);

    // Speak audio prompt simulation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        language === 'mr' ? 'बोलणे सुरू करा' : language === 'hi' ? 'बोलना शुरू करें' : language === 'kn' ? 'ಮಾತನಾಡಲು ಪ್ರಾರಂಭಿಸಿ' : 'Start speaking'
      );
      utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }

    setTimeout(() => {
      setIsListening(false);
      setSpeechSuccess(true);
      if (onSpeechResult) {
        onSpeechResult(sampleText);
      }
      setTimeout(() => setSpeechSuccess(false), 3000);
    }, 2200);
  };

  const isLarge = size === 'large';

  return (
    <div className="inline-flex flex-col items-center">
      <button
        type="button"
        onClick={handleMicClick}
        title={t.speak}
        className={`tap-target rounded-full font-bold flex items-center justify-center transition-all ${
          isListening
            ? 'bg-red-600 text-white animate-mic-pulse ring-4 ring-red-300'
            : speechSuccess
            ? 'bg-green-600 text-white'
            : 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-md hover:opacity-95'
        } ${isLarge ? 'w-24 h-24 text-xl' : 'w-12 h-12 text-base'}`}
        style={{ minWidth: isLarge ? '96px' : '48px', minHeight: isLarge ? '96px' : '48px' }}
      >
        {isListening ? (
          <MicOff className={`${isLarge ? 'w-10 h-10' : 'w-6 h-6'} animate-spin`} />
        ) : (
          <Mic className={`${isLarge ? 'w-10 h-10' : 'w-6 h-6'}`} />
        )}
      </button>

      {label && (
        <span className="text-xs font-semibold mt-1 text-slate-700 dark:text-slate-200">
          {isListening ? t.listening : speechSuccess ? '✓ ' + t.speak : label}
        </span>
      )}

      {isListening && (
        <div className="flex items-center gap-1 text-xs text-red-600 font-bold mt-1 bg-red-50 px-2 py-0.5 rounded border border-red-200">
          <Volume2 className="w-3.5 h-3.5 animate-pulse" />
          <span>Bhashini Voice AI...</span>
        </div>
      )}
    </div>
  );
};
