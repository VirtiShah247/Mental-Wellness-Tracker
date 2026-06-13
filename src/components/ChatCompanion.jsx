import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { getChatResponse } from '../utils/openai';

let msgCounter = 0;
const generateMsgId = () => `${Date.now()}-${msgCounter++}`;

export default function ChatCompanion({ apiKey, model, exam, entries }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi there! I'm Aura, your study wellness digital companion. Preparing for ${exam || 'competitive exams'} is a grueling mental marathon. I'm here 24/7 to listen, help you vent stress, or give you micro-relaxation strategies. How are you holding up today?`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Extract latest analysis context
  const latestAnalysis = entries.length > 0 ? entries[0].analysis : null;

  const quickPrompts = [
    { label: "Bad mock test score", query: "I just scored really poorly on a mock test. I'm starting to panic that I won't clear the exam." },
    { label: "Extreme burnout", query: "I feel completely burned out and exhausted, but I have a huge backlog. I can't focus." },
    { label: "Parental pressure", query: "My parents are constantly asking about my rankings. The pressure is too high." },
    { label: "Can't sleep/anxious", query: "I have massive anxiety and cannot sleep because of the exam date coming up." }
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend.trim();
    if (!query) return;

    // Add user message
    const userMessage = {
      id: generateMsgId(),
      role: 'user',
      content: query,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // API call to OpenAI helper or local mock
      const reply = await getChatResponse(
        [...messages, userMessage],
        apiKey,
        model,
        exam,
        latestAnalysis
      );

      setMessages(prev => [...prev, {
        id: generateMsgId() + '-reply',
        ...reply
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: generateMsgId() + '-error',
        role: 'assistant',
        content: `I'm having trouble processing that right now. Remember, I'm here to support you. Let's take a deep breath together.`,
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear this chat history?")) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Hi there! I'm Aura. I've cleared our chat, but I'm ready to listen whenever you need to vent or rest. What's on your mind?`,
          timestamp: new Date().toISOString()
        }
      ]);
    }
  };

  return (
    <div className="grid grid-cols-3 animate-slide-up" style={{ gap: '1.5rem', textAlign: 'left', maxWidth: '1100px', margin: '0 auto', height: '620px' }}>
      
      {/* LEFT COLUMN: Aura Node & Quick-Prompts (1 Column) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Aura Floating Avatar Card */}
        <div className="card glass flex-center" style={{ flexDirection: 'column', padding: '1.5rem', textAlign: 'center' }}>
          {/* Animated Aura Node */}
          <div className="animate-float" style={{
            position: 'relative',
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--indigo) 0%, var(--violet) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
            boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)'
          }}>
            {/* Pulsing Outer rings */}
            <div style={{
              position: 'absolute',
              top: '-5%',
              left: '-5%',
              width: '110%',
              height: '110%',
              borderRadius: '50%',
              border: '2px solid rgba(139, 92, 246, 0.2)',
              animation: 'pulse-glow 3s infinite ease-in-out'
            }} />
            <Bot size={40} color="white" />
          </div>

          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>Aura</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Empathetic Companion
          </span>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: '1.5' }}>
            Aura analyzes your emotional cues and uses cognitive reframing techniques to help release stress.
          </p>
        </div>

        {/* Quick Vent Prompts Card */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Quick Vent Scenarios
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.query)}
                className="btn btn-secondary"
                disabled={isLoading}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.5rem 0.75rem',
                  textAlign: 'left',
                  justifyContent: 'flex-start',
                  whiteSpace: 'normal',
                  lineHeight: '1.3',
                  borderRadius: '6px'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: The Chat Area (2 Columns) */}
      <div className="card glass glow-border" style={{
        gridColumn: 'span 2',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
      }}>
        {/* Chat Header */}
        <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="indicator" style={{ background: 'var(--color-energetic)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Aura is online</span>
          </div>
          
          <button
            onClick={clearChat}
            aria-label="Clear chat history"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem'
            }}
          >
            <Trash2 size={12} aria-hidden="true" /> Clear Chat
          </button>
        </div>

        {/* Messages Feed */}
        <div 
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            paddingRight: '0.5rem',
            marginBottom: '1rem'
          }}
        >
          {messages.map((msg) => {
            const isAI = msg.role === 'assistant';
            
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignSelf: isAI ? 'flex-start' : 'flex-end',
                  maxWidth: '85%',
                  flexDirection: isAI ? 'row' : 'row-reverse',
                  animation: 'fadeIn var(--transition-fast) forwards'
                }}
              >
                {/* Avatar Icon */}
                <div 
                  aria-hidden="true"
                  style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    background: isAI ? 'var(--indigo-glow)' : 'var(--violet-glow)',
                    border: `1px solid ${isAI ? 'rgba(99, 102, 241, 0.3)' : 'rgba(139, 92, 246, 0.3)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {isAI ? <Bot size={14} color="var(--indigo)" /> : <User size={14} color="var(--violet)" />}
                </div>

                {/* Message Bubble */}
                <div 
                  aria-label={isAI ? "Aura said" : "You said"}
                  style={{
                    background: isAI ? 'var(--bg-card)' : 'linear-gradient(135deg, var(--indigo) 0%, var(--violet) 100%)',
                    border: isAI ? '1px solid var(--border-color)' : 'none',
                    color: 'white',
                    padding: '0.65rem 0.95rem',
                    borderRadius: isAI ? '0 12px 12px 12px' : '12px 0 12px 12px',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    textAlign: 'left',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {/* AI Loading Bubble */}
          {isLoading && (
            <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'flex-start' }} aria-busy="true" aria-label="Aura is composing response">
              <div 
                aria-hidden="true"
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  background: 'var(--indigo-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot size={14} color="var(--indigo)" />
              </div>
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                padding: '0.65rem 0.95rem',
                borderRadius: '0 12px 12px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <span className="indicator animate-breathe" style={{ width: '6px', height: '6px', background: 'var(--text-secondary)' }} />
                <span className="indicator animate-breathe" style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', animationDelay: '0.2s' }} />
                <span className="indicator animate-breathe" style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
            style={{ display: 'flex', gap: '0.5rem' }}
          >
            <input
              type="text"
              placeholder="Vent your thoughts or tell Aura how study went today..."
              className="input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              aria-label="Chat message to Aura"
              style={{ fontSize: '0.85rem', padding: '0.65rem 1rem' }}
            />
            <button
              type="submit"
              className="btn btn-primary animate-fade-in"
              disabled={isLoading || !inputText.trim()}
              aria-label="Send message to Aura"
              style={{ padding: '0 1rem', aspectRatio: '1', borderRadius: 'var(--border-radius-sm)' }}
            >
              <Send size={16} aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
