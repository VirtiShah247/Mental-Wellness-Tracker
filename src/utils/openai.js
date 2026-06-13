/**
 * Zenith AI - OpenAI API Integration Utility & Local Failsafe Mock Engine
 * Handles client-side API requests to OpenAI or falls back to a rules-based mock system.
 */

// Helper to check if API key is provided and looks valid
export const hasValidKey = (key) => {
  return typeof key === 'string' && key.trim().startsWith('sk-');
};

/**
 * Parses journal text using keyword matching to simulate high-fidelity AI wellness feedback.
 * Acts as a local fallback when no API key is configured.
 */
const runMockAnalysis = (text, exam) => {
  const lowercaseText = text.toLowerCase();
  const triggers = [];
  const distortions = [];
  let sentimentScore = 70; // Default baseline
  let primaryEmotion;
  let summary;
  let coping;

  // 1. Analyze Keywords for Triggers & Distortions
  if (lowercaseText.includes('test') || lowercaseText.includes('mock') || lowercaseText.includes('score') || lowercaseText.includes('percentile') || lowercaseText.includes('rank') || lowercaseText.includes('marks')) {
    triggers.push("Mock Test Outcomes");
    sentimentScore -= 15;
    if (lowercaseText.includes('fail') || lowercaseText.includes('ruin') || lowercaseText.includes('never')) {
      distortions.push("Catastrophizing (Overestimating negative outcomes)");
      sentimentScore -= 10;
    }
  }

  if (lowercaseText.includes('time') || lowercaseText.includes('schedule') || lowercaseText.includes('hour') || lowercaseText.includes('syllabus') || lowercaseText.includes('pending') || lowercaseText.includes('backlog')) {
    triggers.push("Syllabus & Time Pressure");
    sentimentScore -= 10;
  }

  if (lowercaseText.includes('parent') || lowercaseText.includes('father') || lowercaseText.includes('mother') || lowercaseText.includes('family') || lowercaseText.includes('expectation') || lowercaseText.includes('pressure')) {
    triggers.push("Family & Social Expectations");
    sentimentScore -= 15;
    distortions.push("Should Statement (Placing unrealistic demands on self)");
  }

  if (lowercaseText.includes('friend') || lowercaseText.includes('classmate') || lowercaseText.includes('peer') || lowercaseText.includes('compare') || lowercaseText.includes('everyone else')) {
    triggers.push("Peer Comparison");
    sentimentScore -= 10;
    distortions.push("Impostor Syndrome (Feeling like a fraud compared to peers)");
  }

  if (lowercaseText.includes('sleep') || lowercaseText.includes('tired') || lowercaseText.includes('exhaust') || lowercaseText.includes('burnout') || lowercaseText.includes('sleepy') || lowercaseText.includes('headache')) {
    triggers.push("Fatigue & Sleep Deprivation");
    sentimentScore -= 15;
  }

  if (lowercaseText.includes('worry') || lowercaseText.includes('fear') || lowercaseText.includes('anxious') || lowercaseText.includes('panic') || lowercaseText.includes('scared') || lowercaseText.includes('nervous')) {
    sentimentScore -= 10;
  }

  // Normalize sentiment score
  sentimentScore = Math.max(15, Math.min(95, sentimentScore));

  // Determine Primary Emotion based on score and keywords
  if (sentimentScore < 40) {
    primaryEmotion = lowercaseText.includes('tired') ? "Fatigued" : "Overwhelmed";
  } else if (sentimentScore < 60) {
    primaryEmotion = lowercaseText.includes('fear') || lowercaseText.includes('worry') ? "Anxious" : "Stressed";
  } else if (sentimentScore >= 80) {
    primaryEmotion = "Energetic";
  } else {
    primaryEmotion = "Focused";
  }

  // If no triggers detected, add a baseline
  if (triggers.length === 0) {
    triggers.push("General Exam Routine");
  }

  // 2. Generate customized summary and coping mechanism based on triggers and exam
  const examLabel = exam || "competitive exams";

  if (triggers.includes("Mock Test Outcomes")) {
    summary = `You are experiencing heightened anxiety centered around your mock test scores for ${examLabel}. You are placing a heavy amount of self-worth on these temporary metrics.`;
    coping = "Implement a '24-Hour Buffer Rule' after taking a mock exam. Do not review the paper or check answers immediately; allow your emotions to cool down, then analyze errors objectively.";
  } else if (triggers.includes("Peer Comparison")) {
    summary = `It looks like you are comparing your academic progress to peers, triggering feelings of inadequacy or impostor syndrome during your ${examLabel} prep.`;
    coping = "Limit discussion of mock scores or syllabus coverage with classmates. Keep a private 'Wins Journal' listing three items of personal progress daily, no matter how small.";
  } else if (triggers.includes("Family & Social Expectations")) {
    summary = `You are carrying a heavy burden of parental and family expectations, which is causing you to feel restricted and highly anxious about failing.`;
    coping = "Try writing down what you can control today (your study hours, breathing exercises, focus) versus what you cannot control (exam results, other people's feelings). Re-focus on the list of control.";
  } else if (triggers.includes("Fatigue & Sleep Deprivation")) {
    summary = `Your journal reflects physical and mental fatigue. Extreme fatigue and lack of sleep are impairing your memory retention and focus for ${examLabel}.`;
    coping = "Enforce a hard stop on study sessions at least 45 minutes before sleep. Turn off all blue light screens and perform a 5-minute deep breathing session before getting into bed.";
  } else if (triggers.includes("Syllabus & Time Pressure")) {
    summary = `You are feeling overwhelmed by the volume of the ${examLabel} syllabus and backlogs, leading to a sense of running out of time.`;
    coping = "Break down your daily goals into 45-minute blocks using the Pomodoro technique. Select just one 'Must-Win' concept to master today, rather than trying to fix all backlogs at once.";
  } else {
    summary = `You are maintaining a decent focus on your ${examLabel} preparation, though a baseline of exam stress is present in your daily routine.`;
    coping = "Incorporate a daily 10-minute walk outside or a breathing exercise before your main study block to keep your nervous system in a balanced, receptive state.";
  }

  if (distortions.length === 0) {
    distortions.push("None detected. Good emotional awareness!");
  }

  return {
    sentiment: sentimentScore,
    emotion: primaryEmotion,
    triggers: triggers,
    distortions: distortions,
    summary: summary,
    coping: coping
  };
};

/**
 * Simulates a chatbot dialogue response based on the student's current emotional state.
 * Fallback chat responses.
 */
const runMockChatResponse = (messages, exam, lastAnalysis) => {
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content.toLowerCase() || '';
  let reply;

  const examLabel = exam || "your exam";

  if (lastUserMessage.includes('hello') || lastUserMessage.includes('hi ') || lastUserMessage.includes('hey')) {
    reply = `Hello! I'm Aura, your wellness companion. I know preparing for ${examLabel} is a marathon, not a sprint. How are you feeling right now? Remember, you can vent to me freely.`;
  } else if (lastUserMessage.includes('fail') || lastUserMessage.includes('mock') || lastUserMessage.includes('score')) {
    reply = `It's completely natural to feel discouraged by mock scores. But please remember: mock tests are diagnostic tools, not predictions. They exist to point out what you don't know *before* the actual exam day. What was the most frustrating part of this particular test?`;
  } else if (lastUserMessage.includes('burnout') || lastUserMessage.includes('tired') || lastUserMessage.includes('exhausted') || lastUserMessage.includes('cant study')) {
    reply = `I hear you. Burnout is your brain's alarm system screaming that you've pushed too hard for too long. If you continue, your efficiency drops to near-zero. I highly recommend taking a complete 2-hour guilt-free break right now. Go drink water, listen to music, or close your eyes. Your prep will actually benefit from this rest. Should we do a quick breathing exercise together?`;
  } else if (lastUserMessage.includes('sleep') || lastUserMessage.includes('insomnia') || lastUserMessage.includes('night')) {
    reply = `High-stress exams frequently disrupt sleep, but sleep is actually where your brain consolidates what you studied. Try this: tonight, put your books away at 10 PM. No screens. Do our 4-7-8 breathing exercise in the Mindfulness tab. Your brain needs to cool down to sleep!`;
  } else if (lastUserMessage.includes('parent') || lastUserMessage.includes('family') || lastUserMessage.includes('expectation')) {
    reply = `Parental pressure is one of the hardest things to carry. Often, parents push because they care, but they don't realize how heavy it feels to you. Remember, your worth is not tied to a single exam rank. Try to focus on your effort, and when you can, have a calm, brief conversation with them about your dedication rather than your test scores.`;
  } else if (lastUserMessage.includes('breathing') || lastUserMessage.includes('calm') || lastUserMessage.includes('panic') || lastUserMessage.includes('overwhelmed')) {
    reply = `Take a deep breath with me right now. Inhale for 4 seconds... hold it... exhale for 4 seconds. Let's step away from the study table for just 5 minutes. You are doing the best you can under massive pressure. I am right here with you.`;
  } else {
    // Contextual reply based on last analysis if available
    if (lastAnalysis) {
      reply = `I see you are dealing with ${lastAnalysis.emotion.toLowerCase()} feelings. Preparing for ${examLabel} presents a huge load of ${lastAnalysis.triggers.join(', ')}. My best advice right now is: ${lastAnalysis.coping} How does that sound to you?`;
    } else {
      reply = `I understand. Academic milestones like ${examLabel} require immense endurance. Make sure you are breaking your subjects into micro-goals today. Don't worry about the whole syllabus right now. What is one small topic you can finish in the next 30 minutes?`;
    }
  }

  return {
    content: reply,
    role: "assistant",
    timestamp: new Date().toISOString()
  };
};

/**
 * Public function to analyze a journal entry.
 * Calls OpenAI if a valid key is provided; otherwise, runs the local mock engine.
 */
export const analyzeJournalEntry = async (text, apiKey, model = 'gpt-4o-mini', exam = '') => {
  if (!text || text.trim().length < 5) {
    throw new Error("Journal entry is too short to analyze.");
  }

  // Failsafe Mock Fallback
  if (!hasValidKey(apiKey)) {
    // Delay slightly to simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));
    return runMockAnalysis(text, exam);
  }

  const systemPrompt = `You are "Aura", an empathetic, expert psychological wellness AI companion specializing in supporting students preparing for high-stakes competitive academic exams (like JEE, NEET, UPSC, Board Exams).
Your task is to analyze the student's daily journal entry and return a structured JSON response.

Examine the text for:
1. Sentiment score (1 to 100, where 1 means crisis/extreme anxiety/burnout, and 100 means complete calm, energy, and peace).
2. Primary emotion (Choose exactly one: "Energetic", "Focused", "Calm", "Fatigued", "Stressed", "Anxious", "Overwhelmed").
3. Specific stress triggers (e.g. Mock Test Outcomes, Syllabus & Time Pressure, Peer Comparison, Family & Social Expectations, Sleep Deprivation, Lack of Focus, Fear of Failure).
4. Cognitive distortions or unhealthy self-talk (e.g. Catastrophizing, All-or-nothing thinking, Impostor Syndrome, "Should" statements, Labeling, or None).
5. A brief, highly empathetic 2-sentence emotional summary.
6. A single, actionable, highly practical academic-wellness coping strategy tailored to their specific triggers. Keep it concrete (e.g., specific study intervals, breathing habits, mock test behaviors).

You MUST return ONLY a valid JSON object matching this structure (no markdown formatting, no backticks, just raw JSON):
{
  "sentiment": number,
  "emotion": "string",
  "triggers": ["string", "string"],
  "distortions": ["string"],
  "summary": "string",
  "coping": "string"
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        response_format: { type: "json_object" },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Student preparing for: ${exam || 'Competitive Exams'}. Journal entry: "${text}"` }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || `HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const resultText = data.choices[0].message.content;
    return JSON.parse(resultText);
  } catch (error) {
    console.error("OpenAI Journal API Call failed, falling back to mock:", error);
    // Return mock data with an alert property so the UI can flag that it fell back
    const mockData = runMockAnalysis(text, exam);
    mockData.isMockFallback = true;
    mockData.fallbackReason = error.message;
    return mockData;
  }
};

/**
 * Public function to generate chat completions.
 * Calls OpenAI if a valid key is provided; otherwise, runs the local chat mock engine.
 */
export const getChatResponse = async (messages, apiKey, model = 'gpt-4o-mini', exam = '', lastAnalysis = null) => {
  // Failsafe Mock Fallback
  if (!hasValidKey(apiKey)) {
    // Delay slightly to simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000));
    return runMockChatResponse(messages, exam, lastAnalysis);
  }

  const systemPrompt = `You are "Aura", a warm, empathetic digital wellness companion for students preparing for high-stakes competitive exams (e.g. ${exam || 'JEE/NEET/UPSC/Boards'}).
The student is under extreme pressure, facing potential burnout, mock test anxiety, and peer comparison.
Your goal is to act as a supportive, compassionate listener. 
Guidelines:
1. Be encouraging, warm, and validation-focused. Validate their hard work and struggle first.
2. Keep responses relatively short (2-4 sentences max per message) to make it readable on a phone/chat UI.
3. Provide one micro-tip or self-care suggestion per response if appropriate (e.g., Pomodoro breaks, screen pauses, breathing, water).
4. Never give clinical advice or act as a therapist. If they express severe hopelessness or self-harm thoughts, immediately output a warm reminder that support is available and they should talk to parents, a mentor, or contact professional helplines.
5. Use their target exam (${exam}) and recent mood context if relevant. Recent mood analysis: ${lastAnalysis ? JSON.stringify(lastAnalysis) : 'No recent journal'}.`;

  const chatMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.slice(-10).map(m => ({ role: m.role, content: m.content })) // Limit history to last 10 messages for token usage
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: chatMessages,
        temperature: 0.8,
        max_tokens: 250
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || `HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      role: 'assistant',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("OpenAI Chat API Call failed, falling back to mock:", error);
    const mockReply = runMockChatResponse(messages, exam, lastAnalysis);
    mockReply.isMockFallback = true;
    return mockReply;
  }
};
