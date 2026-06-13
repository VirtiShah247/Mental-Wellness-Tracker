import { useState } from 'react';
import { Sparkles, Trash2, Calendar, ShieldAlert, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export default function WellnessDashboard({ entries, deleteEntry, streak, setActiveTab }) {
  const [expandedEntryId, setExpandedEntryId] = useState(null);

  // If no entries, show an empty state dashboard
  if (entries.length === 0) {
    return (
      <div className="card glass animate-slide-up flex-center" style={{
        flexDirection: 'column',
        padding: '4rem 2rem',
        maxWidth: '800px',
        margin: '2rem auto',
        borderRadius: 'var(--border-radius-lg)',
        border: '1px dashed var(--indigo)',
      }}>
        <div style={{
          width: '5rem',
          height: '5rem',
          borderRadius: '50%',
          background: 'var(--indigo-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          color: 'var(--indigo)'
        }}>
          <BookOpen size={40} />
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Your Exam Wellness Space</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Welcome to Zenith! Track your mood, log mock test stress, and vent open-ended daily feelings. Our AI will analyze your journals to identify hidden burnout signals and stress triggers.
        </p>
        <button className="btn btn-primary" onClick={() => setActiveTab('journal')}>
          Write Your First Journal Entry
        </button>
      </div>
    );
  }

  // Get data for sentiment graph (limit to last 7 entries for weekly trend, reverse to have chronological order)
  const chartEntries = [...entries].slice(-7).reverse();
  const latestEntry = entries[0];
  const analysis = latestEntry.analysis || {};

  // Custom SVG Chart calculations
  const chartWidth = 500;
  const chartHeight = 150;
  const padding = 20;
  
  let svgPath = '';
  let svgAreaPath = '';
  const points = [];

  if (chartEntries.length > 1) {
    chartEntries.forEach((entry, idx) => {
      const x = padding + (idx * (chartWidth - padding * 2)) / (chartEntries.length - 1);
      const score = entry.analysis?.sentiment || 70;
      // Invert Y coordinate since SVG Y grows downwards (score 100 = top (padding), score 0 = bottom (chartHeight - padding))
      const y = chartHeight - padding - ((score - 10) * (chartHeight - padding * 2)) / 90;
      points.push({ x, y, score, date: new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) });
    });

    svgPath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    svgAreaPath = `${svgPath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;
  }

  // Helper for mood coloring
  const getMoodColor = (mood) => {
    switch (mood) {
      case 'Energetic': return 'var(--color-energetic)';
      case 'Focused': return 'var(--color-focused)';
      case 'Calm': return 'var(--color-calm)';
      case 'Fatigued': return 'var(--color-fatigued)';
      case 'Stressed': return 'var(--color-stressed)';
      case 'Anxious': return 'var(--color-anxious)';
      case 'Overwhelmed': return 'var(--color-overwhelmed)';
      default: return 'var(--indigo)';
    }
  };

  const getSentimentText = (score) => {
    if (score >= 80) return { label: 'High Resilience', color: 'var(--color-energetic)' };
    if (score >= 60) return { label: 'Moderate Balance', color: 'var(--color-calm)' };
    if (score >= 40) return { label: 'Moderate Stress', color: 'var(--color-fatigued)' };
    return { label: 'High Burnout Risk', color: 'var(--color-anxious)' };
  };

  const sentimentStats = getSentimentText(analysis.sentiment || 70);

  return (
    <div className="grid grid-cols-2 animate-slide-up" style={{ gap: '2rem', textAlign: 'left' }}>
      
      {/* LEFT COLUMN: Latest AI Insights & Trends */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Latest Entry Stress Insight Card */}
        <div className="card glow-border" style={{ borderLeft: `6px solid ${getMoodColor(latestEntry.mood)}` }}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              LATEST ANALYSIS ({new Date(latestEntry.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })})
            </span>
            <span style={{
              background: `${getMoodColor(latestEntry.mood)}15`,
              color: getMoodColor(latestEntry.mood),
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              textTransform: 'uppercase'
            }}>
              {latestEntry.mood}
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--indigo)" /> Wellness Status:
            <span style={{ color: sentimentStats.color }}>{sentimentStats.label} ({analysis.sentiment}%)</span>
          </h3>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: '1.6' }}>
            {analysis.summary}
          </p>

          {/* Trigger list */}
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              IDENTIFIED TRIGGERS:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {analysis.triggers?.map((trig, idx) => (
                <span key={idx} style={{
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)'
                }}>{trig}</span>
              ))}
            </div>
          </div>

          {/* Actionable coping strategy box */}
          <div style={{
            background: 'var(--indigo-glow)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '0.85rem 1rem'
          }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '0.25rem' }}>
              Personalized Coping Recommendation:
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
              {analysis.coping}
            </p>
          </div>
        </div>

        {/* Cognitive Distortion Reframer */}
        {analysis.distortions && analysis.distortions[0] !== 'None detected. Good emotional awareness!' && analysis.distortions.length > 0 && (
          <div className="card" style={{
            background: 'rgba(245, 158, 11, 0.03)',
            borderColor: 'rgba(245, 158, 11, 0.2)',
          }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <ShieldAlert size={24} color="var(--color-fatigued)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fcd34d', marginBottom: '0.25rem' }}>
                  Mind Reframer Alarm
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                  We detected a thinking pattern in your log: <strong>{analysis.distortions.join(', ')}</strong>. In exam prep, this kind of framing triggers intense performance blockades.
                </p>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderLeft: '3px solid var(--color-fatigued)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0 4px 4px 0'
                }}>
                  <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-primary)' }}>
                    <strong>Perspective Shift:</strong> Try separating mock test outcomes from your overall personal identity. A diagnostic failure is just a map to the final score, not a definition of your intelligence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mood Trend Graph Card */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyBetween: 'space-between', width: '100%' }}>
            <span>Weekly Sentiment Trend</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto', fontWeight: 'normal' }}>
              Last {chartEntries.length} logs
            </span>
          </h3>

          {chartEntries.length > 1 ? (
            <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                role="img" 
                aria-label="Line chart showing weekly sentiment score trend from 10 to 100" 
                style={{ width: '100%', height: 'auto', minWidth: '400px' }}
              >
                <title>Line chart showing weekly sentiment trend</title>
                {/* Background lines */}
                <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3,3" />
                <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3,3" />
                <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(255, 255, 255, 0.08)" />

                {/* Y Axis Labels */}
                <text x={padding - 5} y={padding + 4} fill="var(--text-muted)" fontSize="8" textAnchor="end">100</text>
                <text x={padding - 5} y={chartHeight / 2 + 3} fill="var(--text-muted)" fontSize="8" textAnchor="end">50</text>
                <text x={padding - 5} y={chartHeight - padding + 3} fill="var(--text-muted)" fontSize="8" textAnchor="end">10</text>

                {/* Area Gradient fill */}
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--indigo)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--indigo)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={svgAreaPath} fill="url(#chartGlow)" aria-hidden="true" />

                {/* Draw Main Trend Line */}
                <path d={svgPath} fill="none" stroke="var(--indigo)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" />

                {/* Data Points & Tooltips */}
                {points.map((p, idx) => (
                  <g key={idx}>
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r="5" 
                      fill="var(--bg-card)" 
                      stroke="var(--indigo)" 
                      strokeWidth="2" 
                      tabIndex={0}
                      aria-label={`Log score on ${p.date}: ${p.score} percent`}
                      style={{ cursor: 'pointer' }} 
                    />
                    <circle cx={p.x} cy={p.y} r="2" fill="white" aria-hidden="true" />
                    
                    {/* Date label at bottom */}
                    <text x={p.x} y={chartHeight - 4} fill="var(--text-muted)" fontSize="7" textAnchor="middle">
                      {p.date}
                    </text>
                    
                    {/* Value badge */}
                    <text x={p.x} y={p.y - 8} fill="var(--text-primary)" fontSize="7" fontWeight="bold" textAnchor="middle">
                      {p.score}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          ) : (
            <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Submit another daily journal entry to visualize your wellness chart.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: History of Entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Streak & Core summary block */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="card" style={{ flex: 1, padding: '1rem 1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>JOURNAL STREAK</span>
            <h4 style={{ fontSize: '1.5rem', color: '#f97316', fontWeight: 800 }}>{streak} Days</h4>
          </div>
          <div className="card" style={{ flex: 1, padding: '1rem 1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL ENTRIES</span>
            <h4 style={{ fontSize: '1.5rem', color: 'var(--indigo)', fontWeight: 800 }}>{entries.length}</h4>
          </div>
        </div>

        {/* History Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} color="var(--indigo)" aria-hidden="true" />
          <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Journal History</h2>
        </div>

        {/* Expandable History Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '580px', overflowY: 'auto', paddingRight: '0.25rem' }}>
          {entries.map((entry) => {
            const isExpanded = expandedEntryId === entry.id;
            const entryDate = new Date(entry.date);
            const score = entry.analysis?.sentiment || 70;
            
            return (
              <div key={entry.id} className="card" style={{
                padding: '1rem 1.25rem',
                borderLeft: `4px solid ${getMoodColor(entry.mood)}`,
                transition: 'all var(--transition-fast)'
              }}>
                {/* Header row */}
                <div 
                  className="flex-between" 
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-controls={`entry-details-${entry.id}`}
                  onClick={() => setExpandedEntryId(isExpanded ? null : entry.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedEntryId(isExpanded ? null : entry.id); } }}
                  style={{ cursor: 'pointer' }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 700 }}>
                      {entryDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Exam: {entry.exam || 'General'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Score dot */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} role="status" aria-label={`Mood score: ${score}%`}>
                      <span className="indicator" style={{ background: getMoodColor(entry.mood) }} aria-hidden="true" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{score}%</span>
                    </div>

                    {/* Mock badge */}
                    {entry.mockTest && (
                      <span style={{
                        background: 'rgba(245, 158, 11, 0.12)',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        borderRadius: '4px',
                        padding: '0.1rem 0.35rem',
                        fontSize: '0.7rem',
                        color: 'var(--color-fatigued)',
                        fontWeight: 700
                      }}>
                        MOCK TEST
                      </span>
                    )}

                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                      {isExpanded ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
                    </span>
                  </div>
                </div>

                {/* Collapsed snippet */}
                {!isExpanded && (
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: '0.5rem'
                  }}>
                    {entry.text}
                  </p>
                )}

                {/* Expanded content */}
                {isExpanded && (
                  <div 
                    id={`entry-details-${entry.id}`}
                    style={{
                      marginTop: '1rem',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '0.85rem',
                      animation: 'fadeIn var(--transition-fast) forwards'
                    }}
                  >
                    {/* Mock Test Specifics */}
                    {entry.mockTest && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-color)',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--border-radius-sm)',
                        fontSize: '0.8rem',
                        marginBottom: '0.75rem'
                      }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--color-fatigued)' }}>Mock Score:</span>
                        <span>{entry.mockTest.subject} — <strong>{entry.mockTest.score}</strong></span>
                      </div>
                    )}

                    {/* Raw Text */}
                    <div style={{ marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                        YOUR JOURNAL ENTRY:
                      </span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.6', background: 'rgba(0,0,0,0.1)', padding: '0.75rem', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
                        {entry.text}
                      </p>
                    </div>

                    {/* Coping & Distortions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.01)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Empathetic Analysis:</span>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{entry.analysis?.summary}</p>
                      </div>
                      <div style={{ fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                        <span style={{ color: 'var(--indigo)', fontWeight: 600 }}>Coping Action Plan:</span>
                        <p style={{ color: 'var(--text-primary)', marginTop: '0.15rem' }}>{entry.analysis?.coping}</p>
                      </div>
                    </div>

                    {/* Delete entry action */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this journal entry? It will delete the historical stats.")) {
                            deleteEntry(entry.id);
                          }
                        }}
                        className="btn"
                        aria-label="Delete this journal entry"
                        style={{
                          padding: '0.35rem 0.65rem',
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-anxious)',
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={12} aria-hidden="true" />
                        <span>Delete Entry</span>
                      </button>
                    </div>
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
