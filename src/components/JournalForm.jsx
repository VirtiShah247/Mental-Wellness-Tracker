import React, { useState } from 'react';
import { PenTool, BrainCircuit, Sparkles, AlertCircle, HelpCircle, Trophy } from 'lucide-react';
import { analyzeJournalEntry } from '../utils/openai';

export default function JournalForm({ apiKey, model, exam, setExam, addEntry, setActiveTab }) {
  const [text, setText] = useState('');
  const [mood, setMood] = useState('Focused'); // Focused, Energetic, Calm, Fatigued, Stressed, Anxious, Overwhelmed
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  
  // Mock test details
  const [hasMockTest, setHasMockTest] = useState(false);
  const [mockSubject, setMockSubject] = useState('');
  const [mockScore, setMockScore] = useState('');

  const moodOptions = [
    { name: 'Energetic', emoji: '🤩', color: 'var(--color-energetic)', desc: 'High energy, ready to solve problems' },
    { name: 'Focused', emoji: '🙂', color: 'var(--color-focused)', desc: 'Concentrated, flow state, steady study' },
    { name: 'Calm', emoji: '😌', color: 'var(--color-calm)', desc: 'Relaxed, low anxiety, quiet mind' },
    { name: 'Fatigued', emoji: '😴', color: 'var(--color-fatigued)', desc: 'Exhausted, low retention, sleepy' },
    { name: 'Stressed', emoji: '😟', color: 'var(--color-stressed)', desc: 'Pressure, syllabus backlog anxiety' },
    { name: 'Anxious', emoji: '😰', color: 'var(--color-anxious)', desc: 'Panic, racing thoughts, fast heartbeat' },
    { name: 'Overwhelmed', emoji: '😭', color: 'var(--color-overwhelmed)', desc: 'Burned out, want to escape, self-doubt' }
  ];

  const examsList = [
    { value: 'JEE', label: 'JEE (Engineering)' },
    { value: 'NEET', label: 'NEET (Medical)' },
    { value: 'UPSC', label: 'UPSC (Civil Services)' },
    { value: 'CAT', label: 'CAT (Management)' },
    { value: 'GATE', label: 'GATE (Postgrad)' },
    { value: 'CUET', label: 'CUET (UG Admissions)' },
    { value: 'Board Exams', label: '10th / 12th Board Exams' },
    { value: 'Other', label: 'Other Competitive Exams' }
  ];

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (wordCount < 10) {
      setError("Please write a bit more about your day (at least 10 words) so Aura can extract useful patterns.");
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      // Analyze journal using OpenAI helper or mock
      const analysis = await analyzeJournalEntry(text, apiKey, model, exam);
      
      // Construct final entry object
      const newEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        text: text,
        mood: mood,
        exam: exam,
        mockTest: hasMockTest ? { subject: mockSubject, score: mockScore } : null,
        analysis: analysis
      };

      addEntry(newEntry);
      
      // Reset form
      setText('');
      setHasMockTest(false);
      setMockSubject('');
      setMockScore('');
      
      // Redirect to dashboard
      setActiveTab('dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-2 animate-slide-up" style={{ gap: '2rem', textAlign: 'left', maxWidth: '1050px', margin: '0 auto' }}>
      
      {/* Journaling Form Column */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <PenTool size={20} color="var(--indigo)" aria-hidden="true" />
          <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Daily Well-being Log</h2>
        </div>

        <form onSubmit={handleSubmit} className="card glow-border" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Exam Selection */}
          <div>
            <label htmlFor="exam-select" className="label">Target Exam</label>
            <select 
              id="exam-select"
              className="select" 
              value={exam} 
              onChange={(e) => setExam(e.target.value)}
            >
              {examsList.map((ex) => (
                <option key={ex.value} value={ex.value}>{ex.label}</option>
              ))}
            </select>
          </div>

          {/* Quick Mood Emojis */}
          <div>
            <label id="mood-group-label" className="label">Current Emotional State</label>
            <div 
              role="group" 
              aria-labelledby="mood-group-label"
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}
            >
              {moodOptions.map((opt) => {
                const isSelected = mood === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setMood(opt.name)}
                    className="tooltip"
                    aria-pressed={isSelected ? "true" : "false"}
                    aria-label={`${opt.name}: ${opt.desc}`}
                    style={{
                      padding: '0.6rem 0.8rem',
                      background: isSelected ? `${opt.color}20` : 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid',
                      borderColor: isSelected ? opt.color : 'var(--border-color)',
                      borderRadius: 'var(--border-radius-sm)',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all var(--transition-fast)',
                      boxShadow: isSelected ? `0 0 10px ${opt.color}30` : 'none'
                    }}
                  >
                    <span role="img" aria-label={opt.name}>{opt.emoji}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? 700 : 400, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {opt.name}
                    </span>
                    <span className="tooltip-text" id={`mood-desc-${opt.name}`}>{opt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mock Test Toggle */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.01)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '0.85rem 1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                id="mock-test-checkbox"
                type="checkbox"
                checked={hasMockTest}
                onChange={(e) => setHasMockTest(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--indigo)' }}
              />
              <label htmlFor="mock-test-checkbox" style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                Did you take a Mock Test today?
              </label>
            </div>

            {hasMockTest && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', animation: 'fadeIn var(--transition-fast) forwards' }}>
                <div style={{ flex: 2 }}>
                  <label htmlFor="mock-subject" className="sr-only" style={{ display: 'none' }}>Mock test subject or topics</label>
                  <input
                    id="mock-subject"
                    type="text"
                    placeholder="Subject/Topics (e.g. Physics - Mechanics)"
                    className="input"
                    value={mockSubject}
                    onChange={(e) => setMockSubject(e.target.value)}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                    required
                    aria-label="Mock test subject or topics"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label htmlFor="mock-score" className="sr-only" style={{ display: 'none' }}>Mock test score or percentile</label>
                  <input
                    id="mock-score"
                    type="text"
                    placeholder="Score/Percentile (e.g. 94% or 120/300)"
                    className="input"
                    value={mockScore}
                    onChange={(e) => setMockScore(e.target.value)}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                    required
                    aria-label="Mock test score or percentile"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Journal Text */}
          <div>
            <div className="flex-between">
              <label htmlFor="journal-text" className="label">Open-ended Journal & Stress Vent</label>
              <span id="journal-word-counter" style={{ fontSize: '0.75rem', color: wordCount >= 10 ? 'var(--text-secondary)' : 'var(--color-stressed)', fontWeight: 500 }}>
                {wordCount} words {wordCount < 10 && '(Write at least 10 words)'}
              </span>
            </div>
            <textarea
              id="journal-text"
              className="textarea"
              rows={6}
              placeholder="How did study go today? Vented thoughts on mock scores, parents' comments, syllabus backlogs, sleeping cycles, or exam day fears. Aura will analyze these words for stress patterns..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ resize: 'vertical' }}
              aria-describedby="journal-word-counter"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div 
              role="alert"
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '0.75rem',
                display: 'flex',
                gap: '0.5rem',
                color: 'var(--color-anxious)',
                fontSize: '0.85rem'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Action */}
          <div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isAnalyzing}
              style={{ width: '100%', padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {isAnalyzing ? (
                <>
                  <BrainCircuit className="animate-breathe" size={18} aria-hidden="true" />
                  <span>Aura is analyzing stress triggers...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} aria-hidden="true" />
                  <span>Analyze Journal & Log State</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Helpful Companion Prompts Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <BrainCircuit size={20} color="var(--violet)" />
          <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Why Journal on Zenith?</h2>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="var(--indigo)" /> Uncover Hidden Stress Triggers
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
            Standard mood trackers ask you to click a button. Zenith uses advanced NLP to scan your descriptions for academic pressure points, helping you see what triggers your dips (e.g. comparing yourself to class toppers, sleep deprivation, or mock review habits).
          </p>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={16} color="var(--violet)" /> Cognitive Distortion Warnings
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
            A competitive environment breeds negative self-talk like "I failed this mock, my whole future is ruined" (Catastrophizing). Zenith highlights these patterns in your logs, showing you how to reframe them to maintain peak performance.
          </p>

          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={16} color="var(--pink)" /> Safe and Anonymous
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Venting is essential. Your text stays on your browser, so you can speak your raw, unedited feelings freely without worrying about judgment or privacy leaks.
          </p>
        </div>

        {/* Dynamic Journaling tips */}
        <div className="card glass" style={{ borderLeft: '4px solid var(--indigo)', padding: '1rem 1.25rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.35rem' }}>Tips for venting today:</h4>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <li>Mention mock test scores if they are bothering you.</li>
            <li>Write down if you slept poorly or skipped meals.</li>
            <li>Note how you felt studying compared to others.</li>
            <li>State how much of the target topic you finished.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
