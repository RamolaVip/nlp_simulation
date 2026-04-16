import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../App';
import StepByStepPipeline from '../../components/StepByStepPipeline';
import QuizComponent from '../../components/QuizComponent';

const QUIZ_QUESTIONS = [];

const PIPELINE_STEPS = [
  { icon: '📖', label: 'Overview',    color: 'bg-primary-100', description: 'Introduction to Chatbot Simulator concepts and why they matter in NLP.' },
  { icon: '🔍', label: 'Core Ideas',  color: 'bg-blue-100',    description: 'Explore the fundamental ideas and algorithms behind Chatbot Simulator.' },
  { icon: '⚡', label: 'In Practice', color: 'bg-emerald-100', description: 'See Chatbot Simulator applied to real-world text examples.' },
  { icon: '🧪', label: 'Experiment',  color: 'bg-amber-100',   description: 'Try it yourself with the interactive demo below.' },
];

export default function ChatbotSim() {
  const { language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">

      {/* ── Module Header ──────────────────────────────────────────────── */}
      <motion.div
        initial={ opacity: 0, y: -16 }
        animate={ opacity: 1, y: 0 }
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-4xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg mb-4">
          🤖
        </div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
          Module 6
        </p>
        <h1 className="text-4xl font-black gradient-text mb-3">
          {language === 'EN' ? 'Chatbot Simulator' : 'चैटबॉट सिम्युलेटर'}
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          {language === 'EN' ? 'Build and interact with rule-based and ML-powered chatbots.' : 'नियम-आधारित और ML-संचालित चैटबॉट बनाएं।'}
        </p>
      </motion.div>

      {/* ── Pipeline walkthrough ────────────────────────────────────────── */}
      <motion.div
        initial={ opacity: 0, y: 16 }
        animate={ opacity: 1, y: 0 }
        transition={ delay: 0.15 }
        className="card"
      >
        <StepByStepPipeline
          steps={PIPELINE_STEPS}
          title={language === 'EN' ? 'Learning Pipeline' : 'सीखने की पाइपलाइन'}
        />
      </motion.div>

      {/* ── Quiz ────────────────────────────────────────────────────────── */}
      <motion.div
        initial={ opacity: 0, y: 16 }
        animate={ opacity: 1, y: 0 }
        transition={ delay: 0.25 }
      >
        <h2 className="text-2xl font-bold gradient-text mb-4">
          {language === 'EN' ? '🧩 Module Quiz' : '🧩 मॉड्यूल क्विज़'}
        </h2>
        <QuizComponent
          questions={QUIZ_QUESTIONS}
          moduleId={6}
          onComplete={(score, total) => console.log(`Quiz: ${score}/${total}`)}
        />
      </motion.div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Link to="/module/5" className="btn-secondary">← Module 5</Link>
        <Link to="/progress" className="text-sm text-gray-400 hover:text-primary-500 transition-colors">
          📊 {language === 'EN' ? 'View Progress' : 'प्रगति देखें'}
        </Link>
        <Link to="/module/7" className="btn-primary">Module 7 →</Link>
      </div>

    </div>
  );
}
