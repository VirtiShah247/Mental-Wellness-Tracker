import React from 'react';
import { ShieldAlert, PhoneCall, HeartHandshake, Compass, ExternalLink, HelpCircle } from 'lucide-react';

export default function SafetyBanner({ setActiveTab }) {
  const emergencyHelplines = [
    {
      name: "Kiran Mental Health Helpline (Govt)",
      phone: "1800-599-0019",
      available: "24/7 | Free",
      description: "Indian Government initiative offering immediate psychological support, crisis management, and referrals.",
      region: "India"
    },
    {
      name: "Vandrevala Foundation",
      phone: "+91 9999 666 555",
      available: "24/7 | Free",
      description: "Mental health services run by professional counsellors providing compassionate crisis intervention.",
      region: "India"
    },
    {
      name: "Tele-MANAS",
      phone: "14416 or 1800 891 4416",
      available: "24/7 | Free",
      description: "National Tele Mental Health Programme of India offering comprehensive mental health care services.",
      region: "India"
    },
    {
      name: "AASRA Helpline",
      phone: "+91 98204 66726",
      available: "24/7",
      description: "Non-governmental organization providing support for suicide prevention and extreme distress.",
      region: "India / Global"
    }
  ];

  return (
    <div className="animate-slide-up" style={{ textAlign: 'left', maxWidth: '850px', margin: '0 auto' }}>
      {/* Safety Warning Card */}
      <div className="card glow-border" style={{
        background: 'rgba(244, 63, 94, 0.04)',
        borderColor: 'rgba(244, 63, 94, 0.2)',
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        gap: '1rem',
        borderRadius: 'var(--border-radius-md)'
      }}>
        <ShieldAlert size={28} color="var(--color-anxious)" style={{ flexShrink: 0, marginTop: '4px' }} />
        <div>
          <h3 style={{ color: '#fda4af', fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 700 }}>
            Important Medical Disclaimer
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Zenith AI is a digital well-being companion designed to help manage examination stress, track mood patterns, and practice mindfulness. 
            <strong> It is NOT a clinical medical tool, therapist, or crisis counseling center.</strong> 
            If you are experiencing severe emotional distress, panic, thoughts of self-harm, or clinical depression, please reach out to trusted adults, mentors, or contact a professional mental health service immediately. You are not alone.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ gap: '2rem', marginBottom: '2rem' }}>
        {/* Helplines section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <PhoneCall size={20} color="var(--indigo)" />
            <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Active Student Helplines</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {emergencyHelplines.map((line, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '1rem',
                transition: 'border-color var(--transition-fast)'
              }} className="helpline-card">
                <div className="flex-between" style={{ marginBottom: '0.35rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{line.name}</h4>
                  <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: 'var(--bg-card)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                    {line.region}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0' }}>
                  <a href={`tel:${line.phone.replace(/\s+/g, '')}`} style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: 'var(--indigo)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    {line.phone}
                  </a>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({line.available})</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  {line.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Grounding & Self-Calm checklist */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Compass size={20} color="var(--violet)" />
            <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Grounding in Panic (5-4-3-2-1)</h2>
          </div>

          <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              If you feel sudden exam panic, academic overload, or chest tightness, pause studying and do this sensory mindfulness exercise to reset your nervous system:
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.9rem' }}>
                <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--indigo)', width: '1.5rem', height: '1.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                  5
                </span>
                <div>
                  <strong>See</strong>: Look around you and name 5 distinct things you see in the room (e.g. your book, a lamp, a window).
                </div>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.9rem' }}>
                <span style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--violet)', width: '1.5rem', height: '1.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                  4
                </span>
                <div>
                  <strong>Touch</strong>: Pay attention to your body. Touch 4 things near you (e.g. the wooden table, your clothes, your hair, the floor).
                </div>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.9rem' }}>
                <span style={{ background: 'rgba(236, 72, 153, 0.15)', color: 'var(--pink)', width: '1.5rem', height: '1.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                  3
                </span>
                <div>
                  <strong>Hear</strong>: Listen closely. Name 3 sounds you hear in your environment (e.g. the fan humming, birds outside, far-off traffic).
                </div>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.9rem' }}>
                <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-fatigued)', width: '1.5rem', height: '1.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                  2
                </span>
                <div>
                  <strong>Smell</strong>: Notice your breathing. Name 2 things you smell (e.g. coffee, paper pages, fresh air).
                </div>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.9rem' }}>
                <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-energetic)', width: '1.5rem', height: '1.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                  1
                </span>
                <div>
                  <strong>Taste</strong>: Focus on your mouth. Name 1 thing you taste (e.g. the minty toothpaste, water, or simply swallow and relax).
                </div>
              </li>
            </ul>

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', textAlign: 'center' }}>
              <button className="btn btn-outline-indigo" onClick={() => setActiveTab('mindfulness')} style={{ fontSize: '0.85rem' }}>
                Open Interactive Breathe Guide
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Helpful resources list */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <HeartHandshake size={20} color="var(--indigo)" />
          <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Additional Wellness Websites</h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <a href="https://www.nimhans.ac.in" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
            NIMHANS India <ExternalLink size={12} />
          </a>
          <a href="https://www.vandrevalafoundation.com" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
            Vandrevala Trust <ExternalLink size={12} />
          </a>
          <a href="https://www.befrienders.org" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
            Befrienders Worldwide <ExternalLink size={12} />
          </a>
          <a href="https://www.youtube.com/watch?v=inpok4MKVLM" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
            Guided Box Breathing (Video) <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
