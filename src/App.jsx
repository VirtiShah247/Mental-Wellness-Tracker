import { useState } from 'react';
import Navbar from './components/Navbar';
import JournalForm from './components/JournalForm';
import WellnessDashboard from './components/WellnessDashboard';
import ChatCompanion from './components/ChatCompanion';
import MindfulnessGuide from './components/MindfulnessGuide';
import SafetyBanner from './components/SafetyBanner';
import ApiSettingsModal from './components/ApiSettingsModal';

// Starting seed data so the student sees a beautiful populated dashboard on first visit
const seedEntries = [
  {
    id: 'seed-1',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    text: "I took a physics mock test for JEE yesterday and got a horrible score. It felt like everything I studied just vanished. My classmates are scoring 98 percentile and I'm sitting here at 82. I feel like I'm wasting my time and my parents will be so disappointed.",
    mood: 'Anxious',
    exam: 'JEE',
    mockTest: { subject: 'Physics - Mechanics', score: '82 Percentile' },
    analysis: {
      sentiment: 42,
      emotion: 'Anxious',
      triggers: ["Mock Test Outcomes", "Peer Comparison", "Family & Social Expectations"],
      distortions: ["Catastrophizing (Overestimating negative outcomes)", "Impostor Syndrome (Feeling like a fraud compared to peers)"],
      summary: "Your physics mock score has triggered strong fears of academic failure and comparison. You are translating a diagnostic score into a final prediction of failure.",
      coping: "Implement a 24-hour buffer rule on mock tests: do not review the results immediately. Breathe, wait 24 hours, and then review mistakes purely for learning."
    }
  },
  {
    id: 'seed-2',
    date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 Days Ago
    text: "Studied for 11 hours straight but feel like nothing went in. My head is heavy, I stayed up until 3 AM reading organic chemistry mechanisms. I woke up at 7 AM feeling completely exhausted. I have a backlog in biology that I haven't even touched, which makes me feel even more guilty.",
    mood: 'Fatigued',
    exam: 'JEE',
    mockTest: null,
    analysis: {
      sentiment: 58,
      emotion: 'Fatigued',
      triggers: ["Syllabus & Time Pressure", "Fatigue & Sleep Deprivation"],
      distortions: ["Should Statement (Placing unrealistic demands on self)"],
      summary: "Your sleep cycle is severely depleted, lowering your retention and focus. Studying for 11 hours straight with only 4 hours of sleep is causing cognitive exhaustion.",
      coping: "Enforce a hard stop at 10:30 PM tonight. Shut down all books and screens, and try the 4-7-8 calming breath exercise in bed."
    }
  }
];

// Helper to calculate daily journaling streaks
const calculateStreak = (entriesList) => {
  if (!entriesList || entriesList.length === 0) return 0;
  
  // Sort chronological descending
  const sorted = [...entriesList].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Extrapolate local dates YYYY-MM-DD
  const dates = sorted
    .map(e => new Date(e.date).toLocaleDateString())
    .filter((value, index, self) => self.indexOf(value) === index); // Unique values

  if (dates.length === 0) return 0;

  const todayStr = new Date().toLocaleDateString();
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString();

  // If latest entry isn't today or yesterday, streak is broken
  if (dates[0] !== todayStr && dates[0] !== yesterdayStr) {
    return 0;
  }

  let currentStreak = 1;
  let checkDate = new Date(sorted[0].date);

  for (let i = 1; i < sorted.length; i++) {
    const nextDate = new Date(sorted[i].date);
    
    // Diff in days
    const diffTime = Math.abs(checkDate.setHours(0,0,0,0) - nextDate.setHours(0,0,0,0));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      checkDate = nextDate;
    } else if (diffDays > 1) {
      break; // Gap found, stop counting
    }
  }

  return currentStreak;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [entries, setEntries] = useState(() => {
    const cached = localStorage.getItem('zenith_journal_entries');
    if (cached) return JSON.parse(cached);
    localStorage.setItem('zenith_journal_entries', JSON.stringify(seedEntries));
    return seedEntries;
  });
  const [exam, setExam] = useState(() => {
    return localStorage.getItem('zenith_exam_type') || 'JEE';
  });
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('zenith_openai_key') || '';
  });
  const [model, setModel] = useState(() => {
    return localStorage.getItem('zenith_openai_model') || 'gpt-4o-mini';
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [streak, setStreak] = useState(() => {
    const cached = localStorage.getItem('zenith_journal_entries');
    const parsed = cached ? JSON.parse(cached) : seedEntries;
    return calculateStreak(parsed);
  });

  // State persistence watchers
  const handleSetApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem('zenith_openai_key', key);
  };

  const handleSetModel = (selectedModel) => {
    setModel(selectedModel);
    localStorage.setItem('zenith_openai_model', selectedModel);
  };

  const handleSetExam = (selectedExam) => {
    setExam(selectedExam);
    localStorage.setItem('zenith_exam_type', selectedExam);
  };

  // 4. Entry management functions
  const addEntry = (newEntry) => {
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('zenith_journal_entries', JSON.stringify(updated));
    setStreak(calculateStreak(updated));
  };

  const deleteEntry = (id) => {
    const filtered = entries.filter(e => e.id !== id);
    setEntries(filtered);
    localStorage.setItem('zenith_journal_entries', JSON.stringify(filtered));
    setStreak(calculateStreak(filtered));
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        exam={exam}
        openSettings={() => setIsSettingsOpen(true)}
        streak={streak}
      />

      {/* Main Content Layout */}
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        {activeTab === 'dashboard' && (
          <WellnessDashboard
            entries={entries}
            deleteEntry={deleteEntry}
            streak={streak}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'journal' && (
          <JournalForm
            apiKey={apiKey}
            model={model}
            exam={exam}
            setExam={handleSetExam}
            addEntry={addEntry}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'mindfulness' && (
          <MindfulnessGuide />
        )}

        {activeTab === 'chat' && (
          <ChatCompanion
            apiKey={apiKey}
            model={model}
            exam={exam}
            entries={entries}
          />
        )}

        {activeTab === 'safety' && (
          <SafetyBanner
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Bottom Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem 0',
        borderTop: '1px solid var(--border-color)',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        marginTop: 'auto'
      }}>
        <p>Zenith AI Academic Wellness Companion • Secure & Anonymous Study Care</p>
      </footer>

      {/* API Configuration Settings */}
      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={handleSetApiKey}
        model={model}
        setModel={handleSetModel}
      />
    </div>
  );
}
