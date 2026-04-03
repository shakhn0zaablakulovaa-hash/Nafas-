import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ClipboardCheck, Brain, Heart, Sparkles, ArrowRight, RefreshCcw } from 'lucide-react';
import { ASSESSMENT_QUESTIONS, analyzeAssessment } from '../services/gemini';
import { cn } from '../lib/utils';

export default function AssessmentPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ stressLevel: number, motivation: string, summary: string } | null>(null);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    if (step < ASSESSMENT_QUESTIONS.length - 1) {
      setAnswers(newAnswers);
      setStep(step + 1);
    } else {
      submitAssessment(newAnswers);
    }
  };

  const submitAssessment = async (finalAnswers: string[]) => {
    setLoading(true);
    const analysis = await analyzeAssessment(finalAnswers);
    setResult(analysis);
    setLoading(false);
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
          <Brain size={48} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface">AI natijalarni tahlil qilmoqda...</h2>
        <p className="text-on-surface-variant">Iltimos, biroz kuting, bu bir necha soniya vaqt oladi.</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-8 pb-32">
        <header className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary-container mx-auto rounded-full flex items-center justify-center text-primary">
            <Sparkles size={40} />
          </div>
          <h1 className="text-3xl font-bold text-on-surface">Tahlil natijalari</h1>
        </header>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-outline-variant/10 space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="font-bold text-on-surface">Stress darajasi</h3>
              <span className="text-4xl font-black text-primary">{result.stressLevel}%</span>
            </div>
            <div className="w-full h-4 bg-surface-container-low rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${result.stressLevel}%` }}
                className={cn(
                  "h-full rounded-full",
                  result.stressLevel > 70 ? "bg-error" : result.stressLevel > 40 ? "bg-secondary" : "bg-primary"
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Heart size={20} />
              <span>Siz uchun motivatsiya</span>
            </div>
            <p className="text-lg italic text-on-surface leading-relaxed">"{result.motivation}"</p>
          </div>

          <div className="p-6 bg-surface-container-low rounded-xl">
            <h4 className="font-bold text-on-surface mb-2">Xulosa:</h4>
            <p className="text-on-surface-variant leading-relaxed">{result.summary}</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={reset}
              className="flex-1 py-4 bg-surface-container-highest rounded-full font-bold flex items-center justify-center gap-2"
            >
              <RefreshCcw size={20} /> Qayta topshirish
            </button>
            <button
              className="flex-1 py-4 bg-primary text-white rounded-full font-bold shadow-lg"
            >
              Mutaxassis bilan bog'lanish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-12 pb-32">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
          <ClipboardCheck size={16} />
          <span>Psixologik baholash</span>
        </div>
        <h1 className="text-4xl font-bold text-on-surface">O'zingizni qanday <br />his qilyapsiz?</h1>
        <div className="flex gap-2">
          {ASSESSMENT_QUESTIONS.map((_, i) => (
            <div key={i} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-surface-container-highest")} />
          ))}
        </div>
      </header>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl border border-outline-variant/10 space-y-8"
      >
        <h2 className="text-2xl font-bold text-on-surface leading-tight">
          {ASSESSMENT_QUESTIONS[step]}
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {['Juda past', 'Past', 'O\'rtacha', 'Yuqori', 'Juda yuqori'].map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="w-full p-6 text-left bg-surface-container-low hover:bg-primary hover:text-white rounded-xl font-bold transition-all flex justify-between items-center group"
            >
              {option}
              <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </motion.div>

      <p className="text-center text-xs text-outline-variant">
        Javoblaringiz mutlaqo maxfiy saqlanadi va faqat AI tahlili uchun ishlatiladi.
      </p>
    </div>
  );
}
