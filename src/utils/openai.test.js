import { describe, it, expect, vi } from 'vitest';
import { hasValidKey, analyzeJournalEntry, getChatResponse } from './openai';

describe('OpenAI Key Validation Helper', () => {
  it('should validate API key formats correctly', () => {
    expect(hasValidKey('')).toBe(false);
    expect(hasValidKey(null)).toBe(false);
    expect(hasValidKey(undefined)).toBe(false);
    expect(hasValidKey('invalid-key')).toBe(false);
    expect(hasValidKey('sk-12345')).toBe(true);
    expect(hasValidKey('sk-proj-xyz')).toBe(true);
    expect(hasValidKey('   sk-abc   ')).toBe(true);
  });
});

describe('Zenith AI Rules-based Mock Analysis Engine', () => {
  it('should fail if journal entry is too short', async () => {
    await expect(analyzeJournalEntry('', '')).rejects.toThrow('Journal entry is too short to analyze.');
    await expect(analyzeJournalEntry('Shor', '')).rejects.toThrow('Journal entry is too short to analyze.');
  });

  it('should detect Mock Test triggers and Catastrophizing distortion', async () => {
    // We pass empty API key so it triggers the mock analysis
    const entryText = "I did terrible on my mock exam today, I will never clear the JEE exam.";
    const result = await analyzeJournalEntry(entryText, '', 'gpt-4o-mini', 'JEE');
    
    expect(result).toBeDefined();
    expect(result.sentiment).toBeLessThan(70);
    expect(result.triggers).toContain("Mock Test Outcomes");
    expect(result.distortions).toContain("Catastrophizing (Overestimating negative outcomes)");
    expect(result.emotion).toBeDefined();
    expect(result.summary).toContain("mock test");
    expect(result.coping).toBeDefined();
  });

  it('should detect Syllabus Pressure trigger and appropriate emotional states', async () => {
    const entryText = "The syllabus backlog is huge, I don't have enough time to finish schedule.";
    const result = await analyzeJournalEntry(entryText, '', 'gpt-4o-mini', 'NEET');
    
    expect(result.triggers).toContain("Syllabus & Time Pressure");
    expect(result.summary).toContain("NEET");
    expect(result.coping).toBeDefined();
  });

  it('should detect Family Expectations and Peer Comparison pressure', async () => {
    const entryText = "My parents have so much expectation, but my classmate friends are scoring much higher and I compare myself.";
    const result = await analyzeJournalEntry(entryText, '', 'gpt-4o-mini', 'UPSC');
    
    expect(result.triggers).toContain("Family & Social Expectations");
    expect(result.triggers).toContain("Peer Comparison");
    expect(result.distortions).toContain("Should Statement (Placing unrealistic demands on self)");
    expect(result.distortions).toContain("Impostor Syndrome (Feeling like a fraud compared to peers)");
  });

  it('should detect Fatigue and sleep triggers', async () => {
    const entryText = "I feel so exhausted and tired, did not sleep well last night, got a massive headache, failed mock test and my parents expectations are high.";
    const result = await analyzeJournalEntry(entryText, '', 'gpt-4o-mini', 'CAT');
    
    expect(result.triggers).toContain("Fatigue & Sleep Deprivation");
    expect(result.emotion).toBe("Fatigued");
  });

  it('should return a baseline if no triggers are matched', async () => {
    const entryText = "Today was just a normal study day, doing some chemistry and mathematics problems.";
    const result = await analyzeJournalEntry(entryText, '', 'gpt-4o-mini', 'GATE');
    
    expect(result.triggers).toContain("General Exam Routine");
    expect(result.distortions).toContain("None detected. Good emotional awareness!");
  });
});

describe('Zenith AI Rules-based Mock Chat Companion', () => {
  it('should greet the user when hi/hello is sent', async () => {
    const messages = [{ role: 'user', content: 'Hello Aura' }];
    const reply = await getChatResponse(messages, '', 'gpt-4o-mini', 'JEE');
    
    expect(reply.role).toBe('assistant');
    expect(reply.content).toContain('companion');
    expect(reply.content).toContain('JEE');
  });

  it('should respond contextually to burnout and fatigue query', async () => {
    const messages = [{ role: 'user', content: 'I am experiencing severe study burnout and feel tired.' }];
    const reply = await getChatResponse(messages, '', 'gpt-4o-mini', 'NEET');
    
    expect(reply.content).toContain('Burnout');
    expect(reply.content).toContain('guilt-free break');
  });

  it('should respond contextually to mock scores distress', async () => {
    const messages = [{ role: 'user', content: 'My mock score was very bad.' }];
    const reply = await getChatResponse(messages, '', 'gpt-4o-mini', 'UPSC');
    
    expect(reply.content).toContain('mock scores');
    expect(reply.content).toContain('diagnostic tools');
  });

  it('should respond contextually based on the last entry analysis when query is generic', async () => {
    const messages = [{ role: 'user', content: 'What should I do now?' }];
    const lastAnalysis = {
      sentiment: 30,
      emotion: "Overwhelmed",
      triggers: ["Syllabus & Time Pressure"],
      distortions: ["Catastrophizing"],
      summary: "Under pressure",
      coping: "Try Pomodoro blocks."
    };
    
    const reply = await getChatResponse(messages, '', 'gpt-4o-mini', 'CAT', lastAnalysis);
    
    expect(reply.content).toContain('overwhelmed');
    expect(reply.content).toContain('Syllabus & Time Pressure');
    expect(reply.content).toContain('Try Pomodoro blocks.');
  });
});
