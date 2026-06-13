import { LayoutDashboard, BookOpen, Wind, MessageSquareHeart, AlertCircle, Settings, Flame } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, exam, openSettings, streak }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'journal', label: 'Daily Journal', icon: BookOpen },
    { id: 'mindfulness', label: 'Mindfulness', icon: Wind },
    { id: 'chat', label: 'Aura Companion', icon: MessageSquareHeart },
    { id: 'safety', label: 'Safety & Support', icon: AlertCircle },
  ];

  return (
    <header className="glass navbar-container" role="banner" style={{
      position: 'sticky',
      top: '1rem',
      zIndex: 50,
      borderRadius: 'var(--border-radius-md)',
      padding: '0.75rem 1.5rem',
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-lg)'
    }}>
      {/* Brand logo */}
      <div 
        role="button"
        tabIndex={0}
        aria-label="Zenith AI Home"
        onClick={() => setActiveTab('dashboard')}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveTab('dashboard'); } }}
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
      >
        <div style={{
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--indigo) 0%, var(--violet) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
        }}>
          <Wind size={20} color="white" aria-hidden="true" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800, letterSpacing: '-0.03em' }}>
            <span className="text-gradient">Zenith</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 500, opacity: 0.8, marginLeft: '0.25rem', color: 'var(--text-secondary)' }}>AI</span>
          </h1>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav aria-label="Primary Site Navigation" style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', padding: '0.25rem 0' }}>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn btn-secondary nav-tab-btn"
              id={`nav-${tab.id}`}
              aria-current={isActive ? 'page' : undefined}
              style={{
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                borderColor: isActive ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                padding: '0.5rem 0.85rem',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: 'var(--border-radius-sm)',
                transition: 'all var(--transition-fast)'
              }}
            >
              <IconComponent size={16} color={isActive ? 'var(--indigo)' : 'var(--text-secondary)'} aria-hidden="true" />
              <span className="nav-label" style={{ fontWeight: isActive ? '600' : '400' }}>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Quick stats & Settings */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Streak counter */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} 
          className="tooltip"
          role="status"
          aria-label={`Daily streak: ${streak} days`}
          aria-describedby="streak-tooltip"
        >
          <Flame size={18} color="#f97316" style={{ filter: 'drop-shadow(0 0 4px rgba(249, 115, 22, 0.4))' }} aria-hidden="true" />
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f97316' }}>{streak}d Streak</span>
          <span className="tooltip-text" id="streak-tooltip">Daily journal check-in streak</span>
        </div>

        {/* Selected exam badge */}
        {exam && (
          <div 
            role="status"
            aria-label={`Selected target exam: ${exam}`}
            style={{
              padding: '0.25rem 0.6rem',
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#c084fc',
              textTransform: 'uppercase'
            }}
          >
            {exam}
          </div>
        )}

        {/* Settings button */}
        <button
          onClick={openSettings}
          className="btn btn-secondary"
          id="btn-settings"
          aria-label="Open settings and API configuration"
          style={{
            padding: '0.5rem',
            borderRadius: 'var(--border-radius-sm)',
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Settings size={18} color="var(--text-secondary)" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
