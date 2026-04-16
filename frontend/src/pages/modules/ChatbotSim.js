import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../App';
import StepByStepPipeline from '../../components/StepByStepPipeline';
import QuizComponent from '../../components/QuizComponent';

/* ── Chatbot rules ─────────────────────────────────────────────────────── */

const BOT_RULES = [
  {
    patterns: [/\b(hello|hi|hey|howdy|greetings|namaste)\b/i],
    responses: [
      'Hi there! 👋 I\'m an NLP chatbot. Ask me about NLP topics!',
      'Hello! I\'m here to help you learn NLP. What would you like to know?',
      'Hey! Great to meet you. Ask me about tokenization, sentiment, or anything NLP!',
    ],
    intent: 'greeting',
  },
  {
    patterns: [/\bwhat.*(nlp|natural language)\b/i],
    responses: [
      'NLP (Natural Language Processing) is the branch of AI that teaches computers to read, understand, and generate human language! 🧠',
    ],
    intent: 'ask_nlp',
  },
  {
    patterns: [/\b(sentiment|emotion|feeling|opinion|positive|negative)\b/i],
    responses: [
      'Sentiment Analysis detects whether text is positive 😊, negative 😠, or neutral 😐. It\'s used in product reviews and social-media monitoring!',
    ],
    intent: 'ask_sentiment',
  },
  {
    patterns: [/\b(ngram|n-gram|bigram|trigram)\b/i],
    responses: [
      'N-grams are sequences of N consecutive words. Bigrams = 2 words, Trigrams = 3 words. They\'re used in language models for autocomplete! 🔗',
    ],
    intent: 'ask_ngram',
  },
  {
    patterns: [/\b(tokenize|tokenization|token)\b/i],
    responses: [
      'Tokenization splits text into individual words or tokens. "I love NLP" → ["I", "love", "NLP"]. It\'s the first step in every NLP pipeline! 🔤',
    ],
    intent: 'ask_tokenize',
  },
  {
    patterns: [/\b(stopword|stop word|remove word)\b/i],
    responses: [
      'Stopwords are common words like "the", "is", "and" that carry little meaning. We often remove them to focus on important words! 🧹',
    ],
    intent: 'ask_stopword',
  },
  {
    patterns: [/\b(stem|stemming|lemma|lemmatization)\b/i],
    responses: [
      'Stemming reduces words to their root form: "running" → "run". Lemmatization is more precise: "better" → "good". Both help normalize text! ✂️',
    ],
    intent: 'ask_stemming',
  },
  {
    patterns: [/\b(machine learning|ml|naive bayes|classifier|classification)\b/i],
    responses: [
      'ML in NLP uses algorithms like Naive Bayes and SVMs to classify text automatically. Trained on labelled examples, they can detect spam, topics, and sentiment! 📈',
    ],
    intent: 'ask_ml',
  },
  {
    patterns: [/\b(ethics|bias|fair|privacy|responsible)\b/i],
    responses: [
      'AI Ethics in NLP is about making sure our models are fair, unbiased, and respectful of privacy. Language models can inherit biases from training data! ⚖️',
    ],
    intent: 'ask_ethics',
  },
  {
    patterns: [/\b(bag of words|bow|tf-idf|tfidf)\b/i],
    responses: [
      'Bag of Words counts how many times each word appears in a document (ignoring order). TF-IDF weighs words by importance — common words get lower scores! 🎒',
    ],
    intent: 'ask_bow',
  },
  {
    patterns: [/\b(help|topic|what can|what do)\b/i],
    responses: [
      'I can answer questions about: NLP basics, tokenization, stopwords, stemming, sentiment analysis, N-grams, Bag of Words, ML in NLP, and AI Ethics! 📚',
    ],
    intent: 'ask_help',
  },
  {
    patterns: [/\b(bye|goodbye|see you|cya|later|quit)\b/i],
    responses: [
      'Goodbye! Keep exploring NLP — it\'s an amazing field! 👋',
      'See you later! Happy learning! 🎓',
    ],
    intent: 'farewell',
  },
  {
    patterns: [/\b(thank|thanks|thank you|thx)\b/i],
    responses: [
      "You're welcome! Glad I could help 😊",
      "Happy to help! Keep learning! 🚀",
    ],
    intent: 'thanks',
  },
];

const DEFAULT_RESPONSE = [
  "I'm a simple rule-based chatbot — I understand NLP keywords! Try asking me about tokenization, sentiment analysis, N-grams, or AI ethics.",
  "Hmm, I didn't catch that. Try asking about an NLP topic like 'what is NLP?' or 'tell me about sentiment analysis'.",
  "I'm not sure about that one! Ask me about NLP topics — tokenization, stopwords, Bag of Words, and more.",
];

function getBotResponse(userText) {
  for (const rule of BOT_RULES) {
    if (rule.patterns.some(p => p.test(userText))) {
      const resp = rule.responses;
      return { text: resp[Math.floor(Math.random() * resp.length)], intent: rule.intent };
    }
  }
  return { text: DEFAULT_RESPONSE[Math.floor(Math.random() * DEFAULT_RESPONSE.length)], intent: 'unknown' };
}

/* ── Quiz + Pipeline ───────────────────────────────────────────────────── */

const QUIZ_QUESTIONS = [
  {
    question: 'What is a rule-based chatbot?',
    options: [
      { text: 'A chatbot that learns from millions of conversations', correct: false },
      { text: 'A chatbot that follows pre-defined patterns and rules to generate responses', correct: true },
      { text: 'A chatbot that only answers in one language', correct: false },
      { text: 'A chatbot powered by neural networks', correct: false },
    ],
    explanation: 'Rule-based chatbots use if-then rules or pattern matching (like regular expressions) to detect user intent and return pre-written responses.',
  },
  {
    question: 'What is "intent detection" in a chatbot?',
    options: [
      { text: 'Translating the user message to English', correct: false },
      { text: 'Counting the number of words in the message', correct: false },
      { text: 'Identifying what the user wants to accomplish with their message', correct: true },
      { text: 'Spell-checking the user message', correct: false },
    ],
    explanation: 'Intent detection classifies a user message into a category (intent) such as "greeting", "ask_price", or "cancel_order".',
  },
  {
    question: 'What technology does a rule-based chatbot use to match user input?',
    options: [
      { text: 'Transformer neural networks', correct: false },
      { text: 'Pattern matching / regular expressions', correct: true },
      { text: 'Convolutional Neural Networks', correct: false },
      { text: 'Reinforcement learning', correct: false },
    ],
    explanation: 'Rule-based bots use regular expressions or keyword lists to detect patterns in user input and select a pre-written response.',
  },
  {
    question: 'What is a key limitation of rule-based chatbots?',
    options: [
      { text: 'They are too slow to run on modern computers', correct: false },
      { text: 'They cannot understand inputs that do not match their pre-defined rules', correct: true },
      { text: 'They can only work with one user at a time', correct: false },
      { text: 'They always give the wrong answer', correct: false },
    ],
    explanation: 'Rule-based bots fail when a user phrases something in an unexpected way. ML-powered chatbots are more flexible.',
  },
  {
    question: 'What does an ML-powered chatbot use that a rule-based one does not?',
    options: [
      { text: 'A keyboard and screen', correct: false },
      { text: 'An internet connection', correct: false },
      { text: 'Trained models that learn from example conversations', correct: true },
      { text: 'A dictionary of words', correct: false },
    ],
    explanation: 'ML chatbots learn from large datasets of example conversations, allowing them to handle a much wider range of inputs without explicit rules.',
  },
];

const PIPELINE_STEPS = [
  {
    icon: '💬', label: 'User Input', color: 'bg-cyan-100',
    description: 'The user types a message. This is the raw text that the chatbot needs to understand.',
    example: '"What is sentiment analysis?"',
  },
  {
    icon: '🔤', label: 'Preprocess', color: 'bg-blue-100',
    description: 'The input is normalised: converted to lowercase, punctuation removed. This makes pattern matching more reliable.',
    example: '"what is sentiment analysis"',
  },
  {
    icon: '🎯', label: 'Intent Detection', color: 'bg-purple-100',
    description: 'Match the preprocessed text against a set of rules or patterns to detect what the user intends to do.',
    example: 'Pattern /sentiment/ → Intent: ask_sentiment ✅',
  },
  {
    icon: '🗂️', label: 'Response Selection', color: 'bg-emerald-100',
    description: 'Look up the response bank for the detected intent and pick the most appropriate reply (may be randomised for variety).',
    example: 'Intent: ask_sentiment → Response bank → Pick response #2',
  },
  {
    icon: '📤', label: 'Send Response', color: 'bg-orange-100',
    description: 'Send the selected response back to the user. The conversation history is updated for context.',
    example: '"Sentiment Analysis detects whether text is positive, negative, or neutral! 😊"',
  },
];

const STARTER_PROMPTS = [
  'Hello!',
  'What is NLP?',
  'Tell me about sentiment analysis',
  'What are N-grams?',
  'What is tokenization?',
  'Tell me about AI ethics',
];

/* ── Component ─────────────────────────────────────────────────────────── */

export default function ChatbotSim() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I\'m an NLP chatbot 🤖 Ask me anything about NLP topics — tokenization, sentiment analysis, N-grams, and more!', intent: null },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function sendMessage(text) {
    const msg = (text ?? inputText).trim();
    if (!msg) return;
    setInputText('');
    setMessages(prev => [...prev, { from: 'user', text: msg, intent: null }]);
    setIsTyping(true);
    setTimeout(() => {
      const { text: botText, intent } = getBotResponse(msg);
      setMessages(prev => [...prev, { from: 'bot', text: botText, intent }]);
      setIsTyping(false);
    }, 700 + Math.random() * 400);
  }

  function clearChat() {
    setMessages([
      { from: 'bot', text: 'Chat cleared! Ask me anything about NLP 🤖', intent: null },
    ]);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-4xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg mb-4">🤖</div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Module 6</p>
        <h1 className="text-4xl font-black gradient-text mb-3">
          {language === 'EN' ? 'Chatbot Simulator' : 'चैटबॉट सिम्युलेटर'}
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          {language === 'EN'
            ? 'Build and interact with a rule-based NLP chatbot. See how intent detection works!'
            : 'एक नियम-आधारित NLP चैटबॉट बनाएं और उससे बात करें।'}
        </p>
      </motion.div>

      {/* ── Concept Card ───────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-cyan-50 border border-cyan-200 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-cyan-700 mb-2">
          💡 {language === 'EN' ? 'How Chatbots Work' : 'चैटबॉट कैसे काम करता है'}
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {language === 'EN'
            ? 'A rule-based chatbot uses pattern matching to understand user messages and return pre-written responses. Modern ML chatbots (like ChatGPT) go further by learning from billions of conversations, but the core principle — detecting intent and generating a response — is the same.'
            : 'एक नियम-आधारित चैटबॉट उपयोगकर्ता संदेशों को समझने के लिए पैटर्न मिलान का उपयोग करता है।'}
        </p>
      </motion.div>

      {/* ── Pipeline ───────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card">
        <StepByStepPipeline
          steps={PIPELINE_STEPS}
          title={language === 'EN' ? 'Chatbot Processing Pipeline' : 'चैटबॉट प्रोसेसिंग पाइपलाइन'}
        />
      </motion.div>

      {/* ── Chat UI ────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            🤖 {language === 'EN' ? 'Chat with the NLP Bot' : 'NLP बॉट से बात करें'}
          </h2>
          <button onClick={clearChat}
            className="text-xs px-3 py-1.5 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors">
            🗑️ {language === 'EN' ? 'Clear' : 'साफ करें'}
          </button>
        </div>

        {/* Quick prompts */}
        <div className="flex flex-wrap gap-2">
          {STARTER_PROMPTS.map((p, i) => (
            <button key={i} onClick={() => sendMessage(p)}
              className="text-xs px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-full hover:bg-cyan-200 transition-colors">
              {p}
            </button>
          ))}
        </div>

        {/* Chat window */}
        <div className="bg-gray-50 rounded-2xl p-4 h-72 overflow-y-auto space-y-3 border border-gray-100">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-2.5 text-sm leading-relaxed
                  ${msg.from === 'user'
                    ? 'bg-cyan-500 text-white rounded-br-none'
                    : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none shadow-sm'}`}>
                  {msg.text}
                  {msg.intent && msg.intent !== 'unknown' && msg.from === 'bot' && (
                    <p className="text-xs mt-1 opacity-50">Intent: {msg.intent}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                      className="w-2 h-2 bg-gray-400 rounded-full" />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input row */}
        <div className="flex gap-3">
          <input
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder={language === 'EN' ? 'Ask about an NLP topic…' : 'NLP विषय के बारे में पूछें…'}
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-cyan-400 focus:outline-none transition-colors"
          />
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => sendMessage()}
            disabled={!inputText.trim() || isTyping}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-sm">
            {language === 'EN' ? 'Send 📤' : 'भेजें 📤'}
          </motion.button>
        </div>
      </motion.div>

      {/* ── Quiz ───────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="text-2xl font-bold gradient-text mb-4">
          {language === 'EN' ? '🧩 Module Quiz' : '🧩 मॉड्यूल क्विज़'}
        </h2>
        <QuizComponent questions={QUIZ_QUESTIONS} moduleId={6}
          onComplete={(score, total) => console.log(`Quiz: ${score}/${total}`)} />
      </motion.div>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
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
