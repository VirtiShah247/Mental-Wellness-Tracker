import { useState, useEffect, useRef } from 'react';
import { Wind, Play, Square, Compass, Clock, Award } from 'lucide-react';

export default function MindfulnessGuide() {
  const [breatheActive, setBreatheActive] = useState(false);
  const [breatheCycle, setBreatheCycle] = useState('box'); // 'box' (4-4-4-4) or 'calm' (4-7-8)
  const [breathePhase, setBreathePhase] = useState('Inhale'); // Inhale, Hold, Exhale, Rest
  const [phaseSeconds, setPhaseSeconds] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  // Guided meditations detail
  const [activeMeditation, setActiveMeditation] = useState(null);

  const timerRef = useRef(null);
  const completedCyclesRef = useRef(completedCycles);

  useEffect(() => {
    completedCyclesRef.current = completedCycles;
  }, [completedCycles]);

  const meditations = [
    {
      id: 'mock-recovery',
      title: 'Mock Test Recovery',
      duration: '3 Mins',
      purpose: 'Ground yourself after a discouraging test score',
      icon: Award,
      color: 'var(--color-stressed)',
      steps: [
        "Put your test paper or screen away. Sit comfortably, close your eyes, and place both feet flat on the floor.",
        "Acknowledge the disappointment. It is okay to feel angry or sad. Let the emotion exist without fighting it.",
        "Inhale deeply, and as you exhale, release the urge to fix or solve anything right now. Tell yourself: 'I am safe. This is one data point, not my final destination.'",
        "Recall that mock exams are built to expose gaps. They are diagnostic, not predictive. Every error you made is a mistake you won't make on the final day.",
        "End with three deep breaths. Gently open your eyes and drink a glass of water. Take a 20-minute break before reviewing the paper."
      ]
    },
    {
      id: 'study-anchor',
      title: 'Study Focus Re-anchor',
      duration: '2 Mins',
      purpose: 'Clear syllabus worry before you start studying',
      icon: Compass,
      color: 'var(--color-focused)',
      steps: [
        "Sit at your study table. Push all books and notifications out of sight for two minutes.",
        "Inhale for 4 seconds, feeling your spine align. Exhale for 4 seconds, letting your shoulders drop.",
        "Look at your backlog list. Realize you cannot study everything at once. You can only study the next 1 page or the next 1 question.",
        "Commit to studying for just 25 minutes. Give yourself permission to ignore the final exam outcome. Focus solely on the immediate concept.",
        "Start your study timer now. Focus on one line at a time."
      ]
    },
    {
      id: 'exam-shield',
      title: 'Exam Morning Calm',
      duration: '4 Mins',
      purpose: 'Reduce palpitations and trembling on exam day',
      icon: Wind,
      color: 'var(--color-anxious)',
      steps: [
        "Find a quiet corner. Keep your eyes closed. Place a hand on your stomach.",
        "Inhale slowly through your nose, letting your belly push your hand outward. Exhale gently through pursed lips.",
        "Your body is experiencing adrenaline, not danger. Trembling and butterflies are natural energy, preparing your brain for alertness. Reframe the energy as: 'My body is preparing to help me succeed.'",
        "Scan your body from head to toe. Wherever you feel tension (jaw, hands), consciously soften those muscles on the exhale.",
        "Remind yourself of the months of consistency you've put in. Whisper: 'I have done the preparation. I will take this one question at a time.'"
      ]
    },
    {
      id: 'sleep-prep',
      title: 'Restful Sleep Prep',
      duration: '5 Mins',
      purpose: 'De-activate your analytical study brain',
      icon: Clock,
      color: 'var(--color-overwhelmed)',
      steps: [
        "Lie down flat in bed. Ensure all lights and screens are off.",
        "Perform the 4-7-8 breathing technique three times: Inhale for 4s, Hold for 7s, Exhale for 8s.",
        "Visualize your textbooks and study material. Imagine placing them inside a heavy wooden chest, closing the lid, and locking it. Tell your brain: 'The study day is done. I am safe to rest. Memory consolidation happens in deep sleep.'",
        "Focus on the weight of your body pressing against the mattress. Feel the sheets.",
        "Allow your thoughts to drift like clouds, returning your focus to the slow rise and fall of your stomach."
      ]
    }
  ];

  // Breathing simulation logic
  useEffect(() => {
    if (!breatheActive) {
      clearInterval(timerRef.current);
      return;
    }

    // timerRef setup

    timerRef.current = setInterval(() => {
      setPhaseSeconds((prev) => {
        if (prev <= 1) {
          // Change phase based on cycle configuration
          let nextPhase = 'Inhale';
          let nextSeconds = 4;

          setBreathePhase((currPhase) => {
            if (breatheCycle === 'box') {
              // Box cycle: Inhale(4s) -> Hold(4s) -> Exhale(4s) -> Hold(4s)
              switch (currPhase) {
                case 'Inhale':
                  nextPhase = 'Hold';
                  nextSeconds = 4;
                  break;
                case 'Hold':
                  if (completedCyclesRef.current % 2 === 0) {
                    nextPhase = 'Exhale';
                    nextSeconds = 4;
                  } else {
                    nextPhase = 'Rest';
                    nextSeconds = 4;
                  }
                  break;
                case 'Exhale':
                  nextPhase = 'Rest';
                  nextSeconds = 4;
                  break;
                case 'Rest':
                  nextPhase = 'Inhale';
                  nextSeconds = 4;
                  setCompletedCycles(c => c + 1);
                  break;
                default:
                  nextPhase = 'Inhale';
                  nextSeconds = 4;
              }
            } else {
              // Calming cycle (4-7-8): Inhale(4s) -> Hold(7s) -> Exhale(8s)
              switch (currPhase) {
                case 'Inhale':
                  nextPhase = 'Hold';
                  nextSeconds = 7;
                  break;
                case 'Hold':
                  nextPhase = 'Exhale';
                  nextSeconds = 8;
                  break;
                case 'Exhale':
                  nextPhase = 'Inhale';
                  nextSeconds = 4;
                  setCompletedCycles(c => c + 1);
                  break;
                default:
                  nextPhase = 'Inhale';
                  nextSeconds = 4;
              }
            }
            return nextPhase;
          });

          return nextSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [breatheActive, breatheCycle]);

  // Translate phase to breathing size scale & text guidance
  const getBreatheStyles = () => {
    if (!breatheActive) {
      return {
        scale: 1.0,
        text: 'Ready',
        bg: 'var(--indigo-glow)',
        borderGlow: '0 0 15px rgba(99, 102, 241, 0.2)'
      };
    }

    switch (breathePhase) {
      case 'Inhale':
        return {
          scale: 1.35,
          text: 'Breathe In',
          bg: 'rgba(6, 182, 212, 0.25)', // Cyan
          borderGlow: '0 0 30px rgba(6, 182, 212, 0.4)'
        };
      case 'Hold':
        return {
          scale: 1.35,
          text: 'Hold Breath',
          bg: 'rgba(139, 92, 246, 0.25)', // Violet
          borderGlow: '0 0 40px rgba(139, 92, 246, 0.4)'
        };
      case 'Exhale':
        return {
          scale: 1.0,
          text: 'Breathe Out',
          bg: 'rgba(99, 102, 241, 0.2)', // Indigo
          borderGlow: '0 0 35px rgba(99, 102, 241, 0.4)'
        };
      case 'Rest':
        return {
          scale: 1.0,
          text: 'Rest',
          bg: 'rgba(15, 23, 42, 0.4)', // Dark Slate
          borderGlow: 'none'
        };
      default:
        return { scale: 1.0, text: 'Breathe', bg: 'var(--indigo-glow)', borderGlow: 'none' };
    }
  };

  const activeStyle = getBreatheStyles();

  return (
    <div className="grid grid-cols-2 animate-slide-up" style={{ gap: '2rem', textAlign: 'left', maxWidth: '1050px', margin: '0 auto' }}>
      
      {/* LEFT COLUMN: Interactive Breathing Coach */}
      <div className="card glass glow-border" style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Wind size={22} color="var(--indigo)" />
          <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Visual Breathing Coach</h2>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem auto', lineHeight: '1.5' }}>
          Slow down your pulse and cool down your sympathetic nervous system. Box breathing is utilized by high-performance athletes to handle pressure.
        </p>

        {/* Breathing cycle selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <button
            onClick={() => { setBreatheCycle('box'); setBreatheActive(false); setBreathePhase('Start'); setPhaseSeconds(4); }}
            className={`btn ${breatheCycle === 'box' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '4px' }}
          >
            Box Breathing (4s-4s-4s-4s)
          </button>
          <button
            onClick={() => { setBreatheCycle('calm'); setBreatheActive(false); setBreathePhase('Start'); setPhaseSeconds(4); }}
            className={`btn ${breatheCycle === 'calm' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderRadius: '4px' }}
          >
            Calming Breath (4s-7s-8s)
          </button>
        </div>

        {/* Dynamic Breathing Circle */}
        <div style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          margin: '2rem auto',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: activeStyle.bg,
          border: '2px solid rgba(255,255,255,0.08)',
          boxShadow: activeStyle.borderGlow,
          transform: `scale(${activeStyle.scale})`,
          transition: 'transform 3.8s ease-in-out, background-color 1s, box-shadow 1s'
        }}>
          {/* Internal text info */}
          <div 
            aria-live="polite" 
            aria-atomic="true"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{activeStyle.text}</span>
            {breatheActive && (
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginTop: '0.25rem' }}>{phaseSeconds}s</span>
            )}
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          {breatheActive ? (
            <button className="btn btn-danger" onClick={() => { setBreatheActive(false); setBreathePhase('Start'); setPhaseSeconds(4); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Square size={16} aria-hidden="true" /> Stop Exercise
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => { setBreatheActive(true); setBreathePhase('Inhale'); setPhaseSeconds(4); setCompletedCycles(0); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Play size={16} aria-hidden="true" /> Start Breathing
            </button>
          )}
        </div>

        {breatheActive && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1rem' }} role="status">
            Cycles Completed: <strong>{completedCycles}</strong>. Keep going for at least 4 cycles.
          </p>
        )}
      </div>

      {/* RIGHT COLUMN: Guided Meditations */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Compass size={22} color="var(--violet)" aria-hidden="true" />
          <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Tailored Guided Meditations</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {meditations.map((med) => {
            const MedIcon = med.icon;
            const isOpened = activeMeditation?.id === med.id;
            
            return (
              <div key={med.id} className="card" style={{
                padding: '1.25rem',
                borderLeft: `4px solid ${med.color}`,
                transition: 'all var(--transition-fast)'
              }}>
                <div 
                  className="flex-between" 
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpened}
                  aria-controls={`med-steps-${med.id}`}
                  onClick={() => setActiveMeditation(isOpened ? null : med)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveMeditation(isOpened ? null : med); } }}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '2.25rem',
                      height: '2.25rem',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: med.color
                    }}>
                      <MedIcon size={16} aria-hidden="true" />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 700 }}>{med.title}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{med.purpose}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} aria-hidden="true" /> {med.duration}
                  </span>
                </div>

                {isOpened && (
                  <div 
                    id={`med-steps-${med.id}`}
                    style={{
                      marginTop: '1.25rem',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '1rem',
                      animation: 'fadeIn var(--transition-fast) forwards'
                    }}
                  >
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {med.steps.map((step, idx) => (
                        <li key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.85rem', lineHeight: '1.5' }}>
                          <span style={{
                            width: '1.25rem',
                            height: '1.25rem',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            color: med.color,
                            flexShrink: 0,
                            marginTop: '2px'
                          }} aria-hidden="true">
                            {idx + 1}
                          </span>
                          <span style={{ color: 'var(--text-primary)' }}>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
