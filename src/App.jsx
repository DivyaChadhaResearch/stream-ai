import { useState, useCallback } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --ink: #0d0d0d;
    --cream: #f5f0e8;
    --gold: #c9a84c;
    --gold-light: #e8c96b;
    --rust: #b5451b;
    --sage: #4a7c59;
    --slate: #2d3b4f;
    --paper: #faf7f2;
    --border: #d4c9b0;
  }

  body { background: var(--cream); font-family: 'DM Sans', sans-serif; color: var(--ink); }

  .app {
    min-height: 100vh;
    background: var(--cream);
    background-image: 
      radial-gradient(circle at 20% 20%, rgba(201,168,76,0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(74,124,89,0.06) 0%, transparent 50%);
  }

  .header {
    border-bottom: 2px solid var(--ink);
    padding: 28px 40px;
    display: flex;
    align-items: baseline;
    gap: 20px;
    background: var(--paper);
  }

  .header-logo {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 900;
    letter-spacing: -1px;
  }

  .header-logo span { color: var(--gold); }

  .header-sub {
    font-size: 12px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #666;
    font-weight: 500;
  }

  .step-bar {
    display: flex;
    border-bottom: 1px solid var(--border);
    background: var(--paper);
    overflow-x: auto;
  }

  .step-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 28px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.5px;
    border-right: 1px solid var(--border);
    white-space: nowrap;
    cursor: default;
    color: #999;
    transition: all 0.2s;
  }

  .step-item.active { color: var(--ink); background: var(--cream); }
  .step-item.done { color: var(--sage); }

  .step-num {
    width: 22px; height: 22px;
    border-radius: 50%;
    border: 1.5px solid currentColor;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px;
    font-weight: 600;
  }

  .step-item.done .step-num {
    background: var(--sage);
    border-color: var(--sage);
    color: white;
  }
  .step-item.done .step-num::after { content: "✓"; }
  .step-item.active .step-num { border-color: var(--gold); color: var(--gold); }

  .main { max-width: 900px; margin: 0 auto; padding: 40px 24px; }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    line-height: 1.2;
  }

  .section-desc {
    color: #666;
    font-size: 14px;
    margin-bottom: 32px;
    line-height: 1.6;
  }

  /* CSV Upload */
  .upload-zone {
    border: 2px dashed var(--border);
    border-radius: 4px;
    padding: 60px 40px;
    text-align: center;
    background: var(--paper);
    cursor: pointer;
    transition: all 0.2s;
  }
  .upload-zone:hover, .upload-zone.drag { border-color: var(--gold); background: #fdf9f0; }
  .upload-icon { font-size: 48px; margin-bottom: 16px; }
  .upload-title { font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 8px; }
  .upload-hint { color: #888; font-size: 13px; }

  .marks-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    margin-top: 24px;
  }
  .marks-table th {
    background: var(--ink);
    color: var(--cream);
    padding: 10px 14px;
    text-align: left;
    font-weight: 500;
    letter-spacing: 0.5px;
    font-size: 11px;
    text-transform: uppercase;
  }
  .marks-table td {
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
    background: var(--paper);
  }
  .marks-table tr:nth-child(even) td { background: var(--cream); }
  .marks-table input {
    width: 56px;
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 4px 6px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    background: white;
    text-align: center;
  }
  .marks-table input:focus { outline: none; border-color: var(--gold); }

  .class-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 2px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .badge-9 { background: #e8f4ea; color: var(--sage); }
  .badge-10 { background: #fff3e0; color: var(--rust); }

  /* Skills Form */
  .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  
  .skill-card {
    background: var(--paper);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 20px;
  }
  .skill-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 600;
    color: #888;
    margin-bottom: 6px;
  }
  .skill-name {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    margin-bottom: 14px;
    color: var(--ink);
  }
  .skill-desc { font-size: 12px; color: #999; margin-bottom: 14px; }

  .slider-wrap { position: relative; }
  .slider {
    width: 100%;
    -webkit-appearance: none;
    height: 3px;
    border-radius: 2px;
    background: linear-gradient(to right, var(--gold) 0%, var(--gold) var(--val, 50%), var(--border) var(--val, 50%), var(--border) 100%);
    outline: none;
    cursor: pointer;
  }
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px; height: 16px;
    border-radius: 50%;
    background: var(--ink);
    border: 2px solid var(--gold);
    cursor: pointer;
  }
  .slider-labels { display: flex; justify-content: space-between; font-size: 10px; color: #aaa; margin-top: 6px; }

  /* Personality */
  .personality-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .personality-card {
    border: 1.5px solid var(--border);
    border-radius: 4px;
    padding: 18px;
    cursor: pointer;
    transition: all 0.15s;
    background: var(--paper);
    text-align: center;
  }
  .personality-card:hover { border-color: var(--gold); }
  .personality-card.selected { border-color: var(--ink); background: var(--ink); color: var(--cream); }
  .personality-emoji { font-size: 28px; margin-bottom: 8px; }
  .personality-name { font-family: 'Playfair Display', serif; font-size: 14px; margin-bottom: 4px; }
  .personality-desc { font-size: 11px; opacity: 0.6; }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    border-radius: 3px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    border: none;
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .btn-primary { background: var(--ink); color: var(--cream); }
  .btn-primary:hover { background: var(--slate); }
  .btn-secondary { background: transparent; color: var(--ink); border: 1.5px solid var(--ink); }
  .btn-secondary:hover { background: var(--ink); color: var(--cream); }
  .btn-gold { background: var(--gold); color: var(--ink); }
  .btn-gold:hover { background: var(--gold-light); }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-row { display: flex; gap: 12px; margin-top: 32px; }

  /* Results */
  .result-hero {
    background: var(--ink);
    color: var(--cream);
    border-radius: 4px;
    padding: 40px;
    margin-bottom: 24px;
    position: relative;
    overflow: hidden;
  }
  .result-hero::before {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%);
    border-radius: 50%;
  }
  .result-stream-label {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 12px;
    font-weight: 600;
  }
  .result-stream-name {
    font-family: 'Playfair Display', serif;
    font-size: 42px;
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 16px;
  }
  .result-confidence {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(201,168,76,0.15);
    border: 1px solid rgba(201,168,76,0.3);
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 13px;
    color: var(--gold-light);
  }
  .conf-bar {
    width: 80px; height: 4px;
    background: rgba(255,255,255,0.15);
    border-radius: 2px;
    overflow: hidden;
  }
  .conf-fill { height: 100%; background: var(--gold); border-radius: 2px; }

  .result-section {
    background: var(--paper);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 28px;
    margin-bottom: 16px;
  }
  .result-section-title {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 600;
    margin-bottom: 16px;
  }
  .reasoning-text {
    font-size: 15px;
    line-height: 1.8;
    color: #333;
  }

  .score-breakdown {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-top: 16px;
  }
  .score-item {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 14px;
  }
  .score-subject { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 4px; }
  .score-val { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; }
  .score-bar-wrap { height: 3px; background: var(--border); border-radius: 2px; margin-top: 8px; }
  .score-bar-fill { height: 100%; border-radius: 2px; }

  .careers-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .career-chip {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 3px;
    font-size: 13px;
    font-weight: 500;
  }
  .career-chip-icon { font-size: 18px; }

  .alt-streams { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .alt-stream-card {
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 16px;
    background: var(--cream);
  }
  .alt-stream-name { font-family: 'Playfair Display', serif; font-size: 16px; margin-bottom: 4px; }
  .alt-stream-score { font-size: 12px; color: #888; }
  .alt-bar-wrap { height: 3px; background: var(--border); border-radius: 2px; margin-top: 10px; }
  .alt-bar-fill { height: 100%; border-radius: 2px; background: var(--gold); }

  .loading-wrap {
    text-align: center;
    padding: 80px 40px;
  }
  .loading-spinner {
    width: 48px; height: 48px;
    border: 3px solid var(--border);
    border-top-color: var(--gold);
    border-radius: 50%;
    margin: 0 auto 24px;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    margin-bottom: 8px;
  }
  .loading-sub { color: #888; font-size: 13px; }

  @media (max-width: 640px) {
    .skills-grid, .personality-grid, .score-breakdown, .careers-grid, .alt-streams { grid-template-columns: 1fr; }
    .header { padding: 20px; }
    .section-title { font-size: 24px; }
    .result-stream-name { font-size: 30px; }
  }
`;

const SUBJECTS = ["English", "II Language", "Mathematics", "Science", "Social Science"];
const CLASSES = ["Class 9", "Class 10"];
const EXAMS = [
  { key: "pt1", label: "PT1", max: 40 },
  { key: "pt2", label: "PT2", max: 40 },
  { key: "pt3", label: "PT3", max: 40 },
  { key: "half", label: "Half-Yearly", max: 80 },
  { key: "annual", label: "Annual", max: 80 },
];

const SKILLS = [
  { key: "puzzle", label: "Puzzle Solving", desc: "Ability to solve logical, analytical, or abstract problems", lo: "Prefer creativity", hi: "Love logic" },
  { key: "speaking", label: "Speaking & Writing", desc: "Communication, debate, essay, storytelling skills", lo: "Prefer numbers", hi: "Love words" },
  { key: "handson", label: "Hands-on Skill", desc: "Building, tinkering, lab experiments, crafting", lo: "Prefer theory", hi: "Love doing" },
  { key: "solo", label: "Solo vs. Social", desc: "Work preference: alone vs. team collaboration", lo: "Love solo", hi: "Love teams" },
  { key: "artlogic", label: "Art vs. Logic", desc: "Creative expression vs. analytical reasoning", lo: "Pure art", hi: "Pure logic" },
  { key: "sticktoit", label: "Stick-to-it-ness", desc: "Perseverance, focus, long-term dedication to goals", lo: "Get bored easily", hi: "Very persistent" },
];

const HOBBIES = [
  { key: "coding", label: "Coding / Tech", emoji: "💻" },
  { key: "art", label: "Art & Design", emoji: "🎨" },
  { key: "sports", label: "Sports & Fitness", emoji: "⚽" },
  { key: "music", label: "Music", emoji: "🎵" },
  { key: "reading", label: "Reading / Writing", emoji: "📚" },
  { key: "science", label: "Science Experiments", emoji: "🔬" },
  { key: "debate", label: "Debate / Drama", emoji: "🎭" },
  { key: "business", label: "Business / Trading", emoji: "💰" },
  { key: "nature", label: "Nature / Travel", emoji: "🌿" },
  { key: "social", label: "Social Work / NGO", emoji: "🤝" },
];

const PERSONALITY_TYPES = [
  { key: "battery", label: "The Battery", emoji: "⚡", desc: "High energy, always enthusiastic" },
  { key: "leader", label: "The Leader", emoji: "👑", desc: "Takes charge, guides others" },
  { key: "brave", label: "The Brave", emoji: "🦁", desc: "Takes risks, faces challenges head-on" },
  { key: "thinker", label: "The Thinker", emoji: "🧠", desc: "Deep, reflective, methodical" },
  { key: "helper", label: "The Helper", emoji: "🤗", desc: "Empathetic, loves supporting others" },
  { key: "creator", label: "The Creator", emoji: "✨", desc: "Imaginative, loves making things" },
];

function initMarks() {
  const m = {};
  CLASSES.forEach(cls => {
    m[cls] = {};
    SUBJECTS.forEach(sub => {
      m[cls][sub] = {};
      EXAMS.forEach(e => { m[cls][sub][e.key] = ""; });
    });
  });
  return m;
}

function calcPercent(marksObj) {
  let total = 0, maxTotal = 0;
  EXAMS.forEach(e => {
    const v = parseFloat(marksObj[e.key]);
    if (!isNaN(v)) { total += v; maxTotal += e.max; }
  });
  return maxTotal > 0 ? (total / maxTotal) * 100 : 0;
}

function getSubjectScore(marks, subject) {
  let total = 0, maxTotal = 0;
  CLASSES.forEach(cls => {
    EXAMS.forEach(e => {
      const v = parseFloat(marks[cls][subject][e.key]);
      if (!isNaN(v)) { total += v; maxTotal += e.max; }
    });
  });
  return maxTotal > 0 ? (total / maxTotal) * 100 : 0;
}

function recommendStream(marks, skills, hobbies, personality) {
  const subScores = {};
  SUBJECTS.forEach(s => { subScores[s] = getSubjectScore(marks, s); });

  const sci = subScores["Science"];
  const math = subScores["Mathematics"];
  const eng = subScores["English"];
  const ss = subScores["Social Science"];
  const lang = subScores["II Language"];

  const puzzleScore = skills.puzzle || 50;
  const speakScore = skills.speaking || 50;
  const handsOn = skills.handson || 50;
  const artLogic = skills.artlogic || 50;
  const stickToIt = skills.sticktoit || 50;

  const hasHobby = (h) => hobbies.includes(h);

  // Stream scoring
  const streams = {
    "Science (PCM)": 0,
    "Science (PCB)": 0,
    "Science (PCMB)": 0,
    "Commerce": 0,
    "Humanities / Arts": 0,
  };

  // Academic weights
  streams["Science (PCM)"] += math * 0.35 + sci * 0.3 + eng * 0.15;
  streams["Science (PCB)"] += sci * 0.4 + eng * 0.2 + math * 0.15;
  streams["Science (PCMB)"] += (math + sci) / 2 * 0.5 + eng * 0.15;
  streams["Commerce"] += math * 0.2 + eng * 0.2 + ss * 0.25;
  streams["Humanities / Arts"] += eng * 0.3 + ss * 0.3 + lang * 0.2;

  // Skill weights
  if (puzzleScore > 60) { streams["Science (PCM)"] += 10; streams["Science (PCMB)"] += 8; streams["Commerce"] += 5; }
  if (artLogic > 60) { streams["Science (PCM)"] += 8; streams["Science (PCB)"] += 5; }
  if (artLogic < 40) { streams["Humanities / Arts"] += 10; }
  if (speakScore > 60) { streams["Humanities / Arts"] += 10; streams["Commerce"] += 7; }
  if (handsOn > 60) { streams["Science (PCB)"] += 8; streams["Science (PCMB)"] += 6; }

  // Hobbies
  if (hasHobby("coding")) { streams["Science (PCM)"] += 12; streams["Science (PCMB)"] += 6; }
  if (hasHobby("science")) { streams["Science (PCB)"] += 10; streams["Science (PCMB)"] += 10; streams["Science (PCM)"] += 6; }
  if (hasHobby("art")) { streams["Humanities / Arts"] += 12; }
  if (hasHobby("reading") || hasHobby("debate")) { streams["Humanities / Arts"] += 8; streams["Commerce"] += 4; }
  if (hasHobby("business")) { streams["Commerce"] += 15; }
  if (hasHobby("social")) { streams["Humanities / Arts"] += 8; streams["Science (PCB)"] += 4; }
  if (hasHobby("music")) { streams["Humanities / Arts"] += 6; }
  if (hasHobby("sports")) { streams["Science (PCB)"] += 4; streams["Science (PCMB)"] += 3; }

  // Personality
  if (personality === "thinker") { streams["Science (PCM)"] += 8; streams["Commerce"] += 4; }
  if (personality === "helper") { streams["Science (PCB)"] += 10; streams["Humanities / Arts"] += 6; }
  if (personality === "creator") { streams["Humanities / Arts"] += 12; streams["Science (PCMB)"] += 4; }
  if (personality === "leader") { streams["Commerce"] += 10; streams["Humanities / Arts"] += 4; }
  if (personality === "battery") { streams["Science (PCMB)"] += 6; streams["Commerce"] += 6; }
  if (personality === "brave") { streams["Commerce"] += 8; streams["Science (PCM)"] += 4; }

  // Normalize
  const max = Math.max(...Object.values(streams));
  const normalized = {};
  Object.entries(streams).forEach(([k, v]) => { normalized[k] = Math.round((v / max) * 100); });

  const sorted = Object.entries(normalized).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0][0];
  const confidence = Math.min(95, Math.max(55, sorted[0][1]));

  const CAREERS = {
    "Science (PCM)": [
      { icon: "🚀", label: "Aerospace Engineer" },
      { icon: "💻", label: "Software Developer" },
      { icon: "⚙️", label: "Mechanical Engineer" },
      { icon: "🏗️", label: "Civil Engineer" },
      { icon: "📡", label: "Electronics Engineer" },
      { icon: "🤖", label: "AI / ML Engineer" },
      { icon: "🔐", label: "Cybersecurity Analyst" },
      { icon: "📐", label: "Architect" },
    ],
    "Science (PCB)": [
      { icon: "🏥", label: "Doctor / Surgeon" },
      { icon: "🌿", label: "Biologist / Botanist" },
      { icon: "🧬", label: "Genetic Researcher" },
      { icon: "💊", label: "Pharmacist" },
      { icon: "🦷", label: "Dentist" },
      { icon: "🐾", label: "Veterinarian" },
      { icon: "🌊", label: "Marine Biologist" },
      { icon: "🏃", label: "Physiotherapist" },
    ],
    "Science (PCMB)": [
      { icon: "🔬", label: "Biomedical Engineer" },
      { icon: "🧪", label: "Biochemist" },
      { icon: "🏥", label: "Doctor / Surgeon" },
      { icon: "💻", label: "Bioinformatics Scientist" },
      { icon: "💊", label: "Pharmacologist" },
      { icon: "🤖", label: "AI in Healthcare" },
      { icon: "🧬", label: "Genetic Engineer" },
      { icon: "🚀", label: "Engineering (any)" },
    ],
    "Commerce": [
      { icon: "📊", label: "Chartered Accountant" },
      { icon: "💼", label: "Business Manager / MBA" },
      { icon: "📈", label: "Investment Banker" },
      { icon: "🏦", label: "Financial Analyst" },
      { icon: "⚖️", label: "Company Secretary" },
      { icon: "🛍️", label: "Entrepreneur" },
      { icon: "📢", label: "Marketing Manager" },
      { icon: "🌐", label: "International Business" },
    ],
    "Humanities / Arts": [
      { icon: "⚖️", label: "Lawyer / Advocate" },
      { icon: "📰", label: "Journalist / Author" },
      { icon: "🎨", label: "Designer / Artist" },
      { icon: "🎭", label: "Actor / Theatre Artist" },
      { icon: "🗺️", label: "Historian / Archaeologist" },
      { icon: "🏛️", label: "Civil Services (IAS/IPS)" },
      { icon: "🧑‍🏫", label: "Educator / Professor" },
      { icon: "🌍", label: "Social Worker / NGO" },
    ],
  };

  const REASONING = {
    "Science (PCM)": `Your strong performance in Mathematics and Science, combined with your analytical thinking style and tech-oriented interests, makes you an ideal candidate for the Science stream with Physics, Chemistry, and Mathematics. You demonstrate the logical problem-solving temperament that thrives in engineering and technology disciplines.`,
    "Science (PCB)": `Your Science scores show a natural affinity for biological and life sciences. Your empathetic personality, hands-on curiosity, and interest in how living systems work point strongly toward a career in medicine, biology, or healthcare — fields where both knowledge and compassion matter.`,
    "Science (PCMB)": `You show exceptional breadth — strong in both Mathematics and Biology, with versatile interests. PCMB gives you maximum flexibility, keeping doors open to both engineering and medical paths while you figure out your exact calling.`,
    "Commerce": `Your aptitude for structured thinking, social engagement, and business-related interests makes Commerce a natural fit. You have the drive and leadership qualities that excel in economics, finance, and management — fields that reward both intelligence and interpersonal skills.`,
    "Humanities / Arts": `Your communication strength, love for language and social understanding, and creative or social personality make Humanities a rich and rewarding path. You're built for roles where ideas, people, and expression matter — law, journalism, civil services, or the arts.`,
  };

  return {
    primary,
    confidence,
    scores: sorted,
    careers: CAREERS[primary] || [],
    reasoning: REASONING[primary] || "",
    subjectPercentages: subScores,
  };
}

export default function App() {
  const [step, setStep] = useState(0); // 0=marks, 1=skills, 2=personality, 3=results
  const [marks, setMarks] = useState(initMarks());
  const [skills, setSkills] = useState({ puzzle: 50, speaking: 50, handson: 50, solo: 50, artlogic: 50, sticktoit: 50 });
  const [hobbies, setHobbies] = useState([]);
  const [personality, setPersonality] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [drag, setDrag] = useState(false);

  const updateMark = (cls, sub, exam, val) => {
    setMarks(prev => ({
      ...prev,
      [cls]: { ...prev[cls], [sub]: { ...prev[cls][sub], [exam]: val } }
    }));
  };

  const parseCSV = (text) => {
    const lines = text.trim().split("\n").filter(l => l.trim());
    if (lines.length < 2) return;
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const newMarks = initMarks();
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map(c => c.trim());
      const cls = cols[headers.indexOf("class_level")] || cols[0];
      const sub = cols[headers.indexOf("subject")] || cols[1];
      const classKey = CLASSES.find(c => cls.toLowerCase().includes(c.toLowerCase().split(" ")[1]));
      const subKey = SUBJECTS.find(s => sub.toLowerCase().includes(s.toLowerCase().split(" ")[0]));
      if (classKey && subKey) {
        EXAMS.forEach((e, idx) => {
          const v = cols[headers.indexOf(e.key.toLowerCase())] || cols[2 + idx];
          if (v !== undefined) newMarks[classKey][subKey][e.key] = v;
        });
      }
    }
    setMarks(newMarks);
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => parseCSV(e.target.result);
    reader.readAsText(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const analyze = () => {
    setLoading(true);
    setTimeout(() => {
      const r = recommendStream(marks, skills, hobbies, personality);
      setResult(r);
      setLoading(false);
      setStep(3);
    }, 2200);
  };

  const STREAM_COLORS = {
    "Science (PCM)": "#2563eb",
    "Science (PCB)": "#16a34a",
    "Science (PCMB)": "#7c3aed",
    "Commerce": "#d97706",
    "Humanities / Arts": "#dc2626",
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="app">
        <div className="header">
          <div className="header-logo">Stream<span>AI</span></div>
          <div className="header-sub">Academic Stream Recommender</div>
        </div>

        <div className="step-bar">
          {["Academic Marks", "Skills & Hobbies", "Personality", "Your Results"].map((s, i) => (
            <div key={i} className={`step-item ${step === i ? "active" : ""} ${step > i ? "done" : ""}`}>
              <div className="step-num">{step > i ? "" : i + 1}</div>
              {s}
            </div>
          ))}
        </div>

        <div className="main">
          {/* STEP 0: MARKS */}
          {step === 0 && (
            <div>
              <div className="section-title">Your Academic Record</div>
              <div className="section-desc">Upload your CSV file or manually enter your marks for Class 9 and 10 below.</div>

              <div
                className={`upload-zone ${drag ? "drag" : ""}`}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("csvInput").click()}
              >
                <div className="upload-icon">📄</div>
                <div className="upload-title">Drop your CSV file here</div>
                <div className="upload-hint">or click to browse — supports .csv format</div>
                <input id="csvInput" type="file" accept=".csv" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
              </div>

              <div style={{ textAlign: "center", margin: "16px 0", color: "#aaa", fontSize: 12, letterSpacing: 1 }}>OR ENTER MANUALLY</div>

              <table className="marks-table">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Subject</th>
                    {EXAMS.map(e => <th key={e.key}>{e.label} /{e.max}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {CLASSES.map(cls => SUBJECTS.map((sub, si) => (
                    <tr key={cls + sub}>
                      {si === 0 && <td rowSpan={SUBJECTS.length}>
                        <span className={`class-badge ${cls.includes("9") ? "badge-9" : "badge-10"}`}>{cls}</span>
                      </td>}
                      <td style={{ fontWeight: 500 }}>{sub}</td>
                      {EXAMS.map(e => (
                        <td key={e.key}>
                          <input
                            type="number"
                            min={0}
                            max={e.max}
                            value={marks[cls][sub][e.key]}
                            onChange={ev => updateMark(cls, sub, e.key, ev.target.value)}
                            placeholder="—"
                          />
                        </td>
                      ))}
                    </tr>
                  )))}
                </tbody>
              </table>

              <div className="btn-row">
                <button className="btn btn-primary" onClick={() => setStep(1)}>Continue to Skills →</button>
              </div>
            </div>
          )}

          {/* STEP 1: SKILLS & HOBBIES */}
          {step === 1 && (
            <div>
              <div className="section-title">Skills & Interests</div>
              <div className="section-desc">Rate yourself on each skill. These human-centric traits help us understand what you truly enjoy.</div>

              <div className="skills-grid">
                {SKILLS.map(sk => (
                  <div key={sk.key} className="skill-card">
                    <div className="skill-label">Skill Assessment</div>
                    <div className="skill-name">{sk.label}</div>
                    <div className="skill-desc">{sk.desc}</div>
                    <div className="slider-wrap">
                      <input
                        type="range" min={0} max={100} value={skills[sk.key]}
                        className="slider"
                        style={{ "--val": `${skills[sk.key]}%` }}
                        onChange={e => setSkills(prev => ({ ...prev, [sk.key]: +e.target.value }))}
                      />
                      <div className="slider-labels"><span>{sk.lo}</span><span style={{ color: "#555", fontSize: 12, fontWeight: 600 }}>{skills[sk.key]}</span><span>{sk.hi}</span></div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 32 }}>
                <div className="section-title" style={{ fontSize: 22 }}>Hobbies & Interests</div>
                <div className="section-desc">Select all that apply.</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {HOBBIES.map(h => (
                    <button
                      key={h.key}
                      className="btn"
                      style={{
                        background: hobbies.includes(h.key) ? "var(--ink)" : "var(--paper)",
                        color: hobbies.includes(h.key) ? "var(--cream)" : "var(--ink)",
                        border: `1.5px solid ${hobbies.includes(h.key) ? "var(--ink)" : "var(--border)"}`,
                        padding: "8px 16px",
                        fontSize: 13,
                      }}
                      onClick={() => setHobbies(prev => prev.includes(h.key) ? prev.filter(x => x !== h.key) : [...prev, h.key])}
                    >
                      {h.emoji} {h.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="btn-row">
                <button className="btn btn-secondary" onClick={() => setStep(0)}>← Back</button>
                <button className="btn btn-primary" onClick={() => setStep(2)}>Continue to Personality →</button>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONALITY */}
          {step === 2 && (
            <div>
              <div className="section-title">Your Personality Type</div>
              <div className="section-desc">Which of these best describes you? Choose the one that feels most true — trust your gut.</div>

              <div className="personality-grid">
                {PERSONALITY_TYPES.map(p => (
                  <div
                    key={p.key}
                    className={`personality-card ${personality === p.key ? "selected" : ""}`}
                    onClick={() => setPersonality(p.key)}
                  >
                    <div className="personality-emoji">{p.emoji}</div>
                    <div className="personality-name">{p.label}</div>
                    <div className="personality-desc">{p.desc}</div>
                  </div>
                ))}
              </div>

              <div className="btn-row">
                <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                <button
                  className="btn btn-gold"
                  disabled={!personality}
                  onClick={analyze}
                >
                  ✦ Analyze My Stream
                </button>
              </div>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="loading-wrap">
              <div className="loading-spinner"></div>
              <div className="loading-text">Analyzing your profile…</div>
              <div className="loading-sub">Processing academic records, skills, and personality traits</div>
            </div>
          )}

          {/* STEP 3: RESULTS */}
          {step === 3 && result && !loading && (
            <div>
              <div className="result-hero">
                <div className="result-stream-label">✦ Primary Stream Recommendation</div>
                <div className="result-stream-name">{result.primary}</div>
                <div className="result-confidence">
                  <div className="conf-bar"><div className="conf-fill" style={{ width: `${result.confidence}%` }}></div></div>
                  {result.confidence}% Match Confidence
                </div>
              </div>

              {/* Reasoning */}
              <div className="result-section">
                <div className="result-section-title">✦ Why This Stream?</div>
                <div className="reasoning-text">{result.reasoning}</div>

                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "#888", marginBottom: 12 }}>Subject Score Breakdown (Average %)</div>
                  <div className="score-breakdown">
                    {SUBJECTS.map(sub => {
                      const pct = Math.round(result.subjectPercentages[sub]);
                      const color = pct >= 70 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626";
                      return (
                        <div key={sub} className="score-item">
                          <div className="score-subject">{sub}</div>
                          <div className="score-val" style={{ color }}>{pct || "—"}%</div>
                          <div className="score-bar-wrap">
                            <div className="score-bar-fill" style={{ width: `${pct}%`, background: color }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Careers */}
              <div className="result-section">
                <div className="result-section-title">✦ Career Opportunities</div>
                <div className="careers-grid">
                  {result.careers.map(c => (
                    <div key={c.label} className="career-chip">
                      <span className="career-chip-icon">{c.icon}</span>
                      {c.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternate Streams */}
              <div className="result-section">
                <div className="result-section-title">✦ Alternative Matches</div>
                <div className="alt-streams">
                  {result.scores.slice(1, 5).map(([name, score]) => (
                    <div key={name} className="alt-stream-card">
                      <div className="alt-stream-name">{name}</div>
                      <div className="alt-stream-score">{score}% compatibility</div>
                      <div className="alt-bar-wrap">
                        <div className="alt-bar-fill" style={{ width: `${score}%`, background: STREAM_COLORS[name] || "#aaa" }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="btn-row">
                <button className="btn btn-secondary" onClick={() => { setStep(0); setResult(null); }}>Start Over</button>
                <button className="btn btn-secondary" onClick={() => setStep(2)}>← Adjust Inputs</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
