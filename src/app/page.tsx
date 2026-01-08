<<<<<<< HEAD
"use client";

import { useState, useRef, useEffect } from "react";
import { Hackathon, UserProfile } from "./types";

type Step = 'LOCATION' | 'UNIVERSITY' | 'MAJOR' | 'SKILLS' | 'RESULTS' | 'GAME_OVER';

// Data Lists (Same as before)
const JORDANIAN_UNIVERSITIES = [
  "University of Jordan", "Jordan University of Science & Technology (JUST)",
  "Princess Sumaya University for Technology (PSUT)", "German-Jordanian University (GJU)",
  "Hashemite University", "Yarmouk University", "Mutah University",
  "Al-Balqa Applied University", "Al-Hussein Bin Talal University",
  "Tafila Technical University", "Al al-Bayt University",
  "Al-Ahliyya Amman University", "Applied Science Private University",
  "Philadelphia University", "Al-Isra University", "Petra University",
  "Al-Zaytoonah University", "Zarqa University", "Irbid National University",
  "Jerash University", "American University of Madaba", "Middle East University",
  "Amman Arab University", "Jadara University", "Ajloun National University",
  "Aqaba University of Technology", "Luminus Technical University College"
];

const AVAILABLE_MAJORS = [
  "Computer Science", "Software Engineering", "Computer Engineering",
  "Artificial Intelligence", "Data Science", "Cybersecurity",
  "Computer Information Systems (CIS)", "Business Information Technology (BIT)",
  "Network Engineering", "Robotics", "Electrical Engineering",
  "Mechatronics", "Graphic Design", "Digital Marketing",
  "Business Administration", "Accounting", "Finance"
];

const AVAILABLE_SKILLS = [
  "Python", "JavaScript", "TypeScript", "React", "Next.js",
  "Node.js", "Java", "C++", "C#", "Rust",
  "Go", "Swift", "Kotlin", "Flutter", "SQL",
  "NoSQL", "Docker", "Kubernetes", "AWS", "Azure",
  "GCP", "TensorFlow", "PyTorch", "OpenAI", "Blockchain",
  "Smart Contracts", "Figma", "UI/UX"
];

export default function Home() {
  const [step, setStep] = useState<Step>('LOCATION');
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    location: "",
    university: "", // Now a string
    major: [],
    skills: []
  });

  const [results, setResults] = useState<Hackathon[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio("/you-need-to-leave_wDmQeme.mp3");
    audioRef.current.loop = true;
  }, []);

  // Manage Audio Playback based on Step
  useEffect(() => {
    if (step === 'GAME_OVER') {
      audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [step]);

  // Auto-focus input on step change
  useEffect(() => {
    if (step === 'LOCATION') {
      inputRef.current?.focus();
    }
  }, [step]);

  // Clear search query when stepping
  useEffect(() => {
    setSearchQuery("");
  }, [step]);

  const handleNext = () => {
    if (step === 'LOCATION') {
      if (!inputValue.trim()) return;
      setUserProfile(prev => ({ ...prev, location: inputValue }));
      setInputValue("");
      setStep('UNIVERSITY');
    } else if (step === 'UNIVERSITY') {
      if (!userProfile.university) return;

      // Easter Egg Logic
      if (userProfile.university === "Philadelphia University") {
        setStep('GAME_OVER');
        return;
      }

      setStep('MAJOR');
    } else if (step === 'MAJOR') {
      if (userProfile.major.length === 0) return;
      setStep('SKILLS');
    } else if (step === 'SKILLS') {
      if (userProfile.skills.length === 0) return;
      handleSearch();
    }
  };

  const toggleSelection = (field: 'university' | 'major' | 'skills', value: string) => {
    setUserProfile(prev => {
      // Special Single Selection for University
      if (field === 'university') {
        const isSelected = prev.university === value;
        return { ...prev, university: isSelected ? "" : value };
      }

      // Multi Selection for Major & Skills
      const list = prev[field] as string[]; // Assertion valid for major/skills
      const exists = list.includes(value);
      if (exists) {
        return { ...prev, [field]: list.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...list, value] };
      }
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    setResults(null);
    setStep('RESULTS');

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile),
      });

      if (!response.ok) throw new Error("Agent failed");

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
      // Fallback or Error UI could go here, for now we just stop loading
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && step === 'LOCATION') {
      handleNext();
    }
  };

  const resetFlow = () => {
    setStep('LOCATION');
    setUserProfile({ location: "", university: "", major: [], skills: [] });
    setResults(null);
    setInputValue("");
    setSearchQuery("");
  };

  const getQuestion = () => {
    switch (step) {
      case 'LOCATION': return "Where are you based?";
      case 'UNIVERSITY': return "Select your University";
      case 'MAJOR': return "Choose your Major(s)";
      case 'SKILLS': return "Select your top skills";
      default: return "Processing...";
    }
  };

  // Filter lists based on search
  const filteredUniversities = JORDANIAN_UNIVERSITIES.filter(u => u.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredMajors = AVAILABLE_MAJORS.filter(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredSkills = AVAILABLE_SKILLS.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

  if (step === 'GAME_OVER') {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-8 bg-white text-red-600 animate-in fade-in zoom-in duration-500">
        <h1 className="text-6xl sm:text-9xl font-black text-center mb-8 uppercase tracking-tighter drop-shadow-sm">
          DEEP SHIT
        </h1>
        <p className="text-2xl text-zinc-900 font-mono text-center max-w-xl mb-12">
          You are at Philadelphia University. There is no hope.
          <br />
          <span className="text-red-500 font-bold block mt-4">START NEW LIFE.</span>
        </p>
        <button
          onClick={resetFlow}
          className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-bold text-xl rounded-full transition-all hover:scale-105 shadow-xl"
        >
          RESTART FROM ZERO
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center p-8 sm:p-20 bg-white text-foreground selection:bg-neon-purple selection:text-white overflow-x-hidden relative">
      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-[128px]"></div>
      </div>

      <main className={`z-10 flex flex-col items-center w-full max-w-4xl gap-8 transition-all duration-700 ${step === 'RESULTS' ? 'mt-10' : 'justify-center min-h-[80vh]'}`}>

        {/* Header Section */}
        <div className="space-y-6 animate-in fade-in zoom-in duration-700 text-center">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-neon-green via-zinc-800 to-neon-purple drop-shadow-sm">
            AI AGENT
          </h1>

          {step !== 'RESULTS' && (
            <div className="h-24 flex flex-col items-center justify-center">
              <p key={step} className="text-2xl sm:text-3xl text-zinc-800 font-light animate-in slide-in-from-bottom-4 fade-in duration-500">
                {getQuestion()}
              </p>
              {(step === 'UNIVERSITY' || step === 'MAJOR' || step === 'SKILLS') && (
                <p className="text-sm text-zinc-500 mt-2 animate-in fade-in delay-200">
                  {step === 'UNIVERSITY' ? "Select one option • Use search to filter" : "Select all that apply • Use search to filter"}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Content Section */}
        {step !== 'RESULTS' && (
          <div className="w-full max-w-4xl relative group animate-in slide-in-from-bottom-8 duration-1000 delay-200 flex flex-col items-center gap-6">

            {/* Search Bar for Selection Steps */}
            {(step === 'UNIVERSITY' || step === 'MAJOR' || step === 'SKILLS') && (
              <div className="w-full max-w-md relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${step.toLowerCase()}...`}
                  className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 px-4 py-2 rounded-lg focus:outline-none focus:border-neon-purple transition-colors text-center shadow-sm"
                  autoFocus
                />
              </div>
            )}

            {/* Selection Clouds */}
            {(step === 'UNIVERSITY' || step === 'MAJOR' || step === 'SKILLS') ? (
              <div className="w-full flex-1 max-h-[40vh] overflow-y-auto no-scrollbar">
                <div className="flex flex-wrap justify-center gap-3 p-2">
                  {/* Render List based on Step */}
                  {(step === 'UNIVERSITY' ? filteredUniversities : step === 'MAJOR' ? filteredMajors : filteredSkills).map((item) => {
                    const field = step === 'UNIVERSITY' ? 'university' : step === 'MAJOR' ? 'major' : 'skills';

                    let isSelected = false;
                    if (field === 'university') {
                      isSelected = userProfile.university === item;
                    } else {
                      isSelected = userProfile[field].includes(item);
                    }

                    return (
                      <button
                        key={item}
                        onClick={() => toggleSelection(field, item)}
                        className={`
                            px-4 py-2 rounded-full border text-sm sm:text-base transition-all duration-300 transform hover:scale-105
                            ${isSelected
                            ? 'bg-neon-green/20 border-neon-green text-zinc-900 shadow-[0_0_10px_rgba(212,230,0,0.3)] font-medium'
                            : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 shadow-sm'}
                          `}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Standard Input for Location */
              <div className="w-full max-w-2xl relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-green to-neon-purple rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative flex items-center bg-white rounded-lg p-1 shadow-xl">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g., Amman, Jordan..."
                    className="w-full bg-white text-zinc-900 placeholder-zinc-400 px-6 py-6 rounded-md focus:outline-none focus:ring-0 text-xl font-mono tracking-wide"
                    autoFocus
                    autoComplete="off"
                  />
                  <button
                    onClick={handleNext}
                    className="absolute right-3 p-3 bg-neon-purple/10 hover:bg-neon-purple text-neon-purple hover:text-white rounded-md transition-all duration-300 border border-neon-purple/20 hover:shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Continue Button for Selection Steps */}
            {(step === 'UNIVERSITY' || step === 'MAJOR' || step === 'SKILLS') && (
              <button
                onClick={handleNext}
                disabled={step === 'UNIVERSITY' ? !userProfile.university : step === 'MAJOR' ? userProfile.major.length === 0 : userProfile.skills.length === 0}
                className={`
                  mt-4 px-8 py-3 rounded-full font-bold tracking-wide transition-all duration-300
                  ${(step === 'UNIVERSITY' ? !!userProfile.university : step === 'MAJOR' ? userProfile.major.length > 0 : userProfile.skills.length > 0)
                    ? 'bg-gradient-to-r from-neon-green to-neon-purple text-black shadow-lg transform hover:-translate-y-1'
                    : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}
                `}
              >
                CONTINUE
              </button>
            )}

            {/* Step Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              <div className={`h-1 w-8 rounded-full transition-all duration-300 ${step === 'LOCATION' ? 'bg-neon-green' : 'bg-zinc-200'}`}></div>
              <div className={`h-1 w-8 rounded-full transition-all duration-300 ${step === 'UNIVERSITY' ? 'bg-neon-green' : 'bg-zinc-200'}`}></div>
              <div className={`h-1 w-8 rounded-full transition-all duration-300 ${step === 'MAJOR' ? 'bg-neon-green' : 'bg-zinc-200'}`}></div>
              <div className={`h-1 w-8 rounded-full transition-all duration-300 ${step === 'SKILLS' ? 'bg-neon-green' : 'bg-zinc-200'}`}></div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-700">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-zinc-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-neon-green border-r-neon-purple border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-zinc-500 font-mono animate-pulse">ANALYZING PROFILE...</p>
          </div>
        )}

        {/* Results Section */}
        {results && !loading && (
          <div className="w-full flex flex-col gap-6 animate-in slide-in-from-bottom-10 fade-in duration-700 pb-20">

            <div className="bg-zinc-50 rounded-xl p-6 border border-zinc-200 shadow-lg">
              <h2 className="text-2xl text-zinc-900 font-bold mb-4">Your Profile Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-500">Location</p>
                  <p className="text-zinc-900 font-medium">{userProfile.location}</p>
                </div>
                <div>
                  <p className="text-zinc-500">University</p>
                  <p className="text-zinc-900 font-medium">{userProfile.university}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Major</p>
                  <p className="text-zinc-900 font-medium">{userProfile.major.join(", ")}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Skills</p>
                  <p className="text-neon-purple font-medium">{userProfile.skills.join(", ")}</p>
                </div>
              </div>
              <button
                onClick={resetFlow}
                className="mt-6 text-xs text-zinc-500 hover:text-zinc-900 border border-zinc-200 px-3 py-1.5 rounded hover:bg-zinc-100 transition-colors"
              >
                START NEW SEARCH
              </button>
            </div>

            {results.some(r => r.tags.includes('Mock Data')) && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      AI Agent Offline
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        We are serving offline results because the <strong>Google API Key</strong> is missing.
                      </p>
                      <p className="mt-1">
                        Please create a <code>.env.local</code> file and add: <code>GOOGLE_GENERATIVE_AI_API_KEY=your_key</code>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <h3 className="text-xl font-bold text-zinc-900 mt-4">Recommended Opportunities</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((hackathon, index) => (
                <div
                  key={hackathon.id}
                  className="bg-white border border-zinc-200 rounded-xl p-6 hover:border-neon-purple/50 transition-all duration-300 hover:shadow-xl flex flex-col gap-4 group/card relative overflow-hidden"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-neon-green to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>

                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-bold px-2 py-1 rounded border ${hackathon.type === 'Online' ? 'border-neon-purple text-neon-purple bg-neon-purple/10' : 'border-neon-green text-zinc-700 bg-neon-green/20'}`}>
                      {hackathon.type.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1 text-neon-purple font-mono text-sm">
                      <span>{hackathon.matchScore}%</span>
                      <span className="text-zinc-400 text-xs">MATCH</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-zinc-900 group-hover/card:text-neon-purple transition-colors">{hackathon.name}</h3>
                    <p className="text-zinc-500 text-sm mt-1">{hackathon.date}</p>
                  </div>

                  <p className="text-zinc-600 text-sm line-clamp-2">
                    {hackathon.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-zinc-100">
                    {hackathon.tags.map(tag => (
                      <span key={tag} className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded">#{tag}</span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-2 text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.315 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {hackathon.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      {hackathon.participation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>


=======
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
>>>>>>> abe30560363498618d161163d07235069690f1cd
    </div>
  );
}
