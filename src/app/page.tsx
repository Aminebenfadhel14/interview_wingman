"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/landing/hero";
import { UploadSection } from "@/components/landing/upload-section";
import { AnalyzingView } from "@/components/session/analyzing-view";
import { GapRadar } from "@/components/session/gap-radar";
import { PracticeMode } from "@/components/session/practice-mode";
import { FeedbackView } from "@/components/session/feedback-view";
import { CheatSheet } from "@/components/session/cheat-sheet";
import type {
  GapAnalysis,
  InterviewQuestion,
  PracticeScores,
  SessionStep,
} from "@/lib/types";

type FeedbackData = {
  scores: PracticeScores;
  improvements: string[];
  improvedAnswer: string;
};

type FallbackResult = { gapAnalysis: GapAnalysis; questions: InterviewQuestion[] };

export default function Home() {
  const [step, setStep] = useState<SessionStep>("upload");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [cheatSheetData, setCheatSheetData] = useState<any>(null);
  const [analyzingStage, setAnalyzingStage] = useState("");
  const [sessionId, setSessionId] = useState("");

  const handleResumeUpload = useCallback((file: File, text: string) => {
    setResumeText(text);
  }, []);

  const handleJobDescription = useCallback((text: string) => {
    setJobDescription(text);
  }, []);

  const handleStartAnalysis = useCallback(async () => {
    setStep("analyzing");
    setAnalyzingStage("Reading your resume...");

    await new Promise((r) => setTimeout(r, 800));
    setAnalyzingStage("Analyzing the job description...");
    await new Promise((r) => setTimeout(r, 800));
    setAnalyzingStage("Finding gaps between your experience...");
    await new Promise((r) => setTimeout(r, 800));
    setAnalyzingStage("Generating personalized questions...");
    await new Promise((r) => setTimeout(r, 800));
    setAnalyzingStage("Almost ready...");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      if (res.ok) {
        const data = await res.json();
        setGapAnalysis(data.gapAnalysis);
        setQuestions(data.questions);
        setSessionId(data.sessionId);
      } else {
        const fallback = generateFallbackAnalysis();
        setGapAnalysis(fallback.gapAnalysis);
        setQuestions(fallback.questions);
      }
    } catch {
      const fallback = generateFallbackAnalysis();
      setGapAnalysis(fallback.gapAnalysis);
      setQuestions(fallback.questions);
    }

    await new Promise((r) => setTimeout(r, 500));
    setStep("gap-radar");
  }, [resumeText, jobDescription]);

  const handlePractice = useCallback((_type: "critical" | "weak" | "strength") => {
    setStep("practice");
    setCurrentQuestionIdx(0);
  }, []);

  const handleAnswer = useCallback(
    async (questionIndex: number, audioBlob: Blob, transcript: string) => {
      try {
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");
        formData.append("question", questions[questionIndex].question);
        formData.append("tip", questions[questionIndex].tip);
        formData.append("resumeText", resumeText);
        formData.append("jobDescription", jobDescription);

        const res = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setFeedback({
            scores: data.scores,
            improvements: data.improvements,
            improvedAnswer: data.improved_answer,
          });
        }
      } catch {
        setFeedback({
          scores: { clarity: 7, relevance: 7, structure: 6, confidence: 7 },
          improvements: [
            "Try to use the STAR method for structure",
            "Include a specific metric or number",
          ],
          improvedAnswer:
            "This is a sample improved answer that demonstrates better structure and specificity. In the real interview, make sure to quantify your achievements and use clear examples.",
        });
      }
    },
    [questions, resumeText, jobDescription]
  );

  const handleNavigateQuestion = useCallback((index: number) => {
    setFeedback(null);
    setCurrentQuestionIdx(index);
  }, []);

  const handleCompletePractice = useCallback(async () => {
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          type: "cheat-sheet",
          gapAnalysis,
          questions,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCheatSheetData(data.cheatSheet);
      } else {
        setCheatSheetData(generateFallbackCheatSheet());
      }
    } catch {
      setCheatSheetData(generateFallbackCheatSheet());
    }
    setStep("cheat-sheet");
  }, [resumeText, jobDescription, gapAnalysis, questions]);

  const handleTryAgain = useCallback(() => {
    setFeedback(null);
  }, []);

  const handleNextQuestion = useCallback(() => {
    setFeedback(null);
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      handleCompletePractice();
    }
  }, [currentQuestionIdx, questions.length, handleCompletePractice]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {step === "upload" && (
            <>
              <HeroSection />
              <UploadSection
                onResumeUpload={handleResumeUpload}
                onJobDescription={handleJobDescription}
                onStart={handleStartAnalysis}
              />
            </>
          )}

          {step === "analyzing" && <AnalyzingView stage={analyzingStage} />}

          {step === "gap-radar" && gapAnalysis && (
            <GapRadar
              analysis={gapAnalysis}
              onPractice={handlePractice}
              onContinue={() => setStep("practice")}
            />
          )}

          {step === "practice" && questions.length > 0 && !feedback && (
            <PracticeMode
              questions={questions}
              currentIdx={currentQuestionIdx}
              onNavigate={handleNavigateQuestion}
              onAnswer={handleAnswer}
              onComplete={handleCompletePractice}
            />
          )}

          {step === "practice" && feedback && (
            <FeedbackView
              scores={feedback.scores}
              improvements={feedback.improvements}
              improvedAnswer={feedback.improvedAnswer}
              onTryAgain={handleTryAgain}
              onNext={handleNextQuestion}
              isLast={currentQuestionIdx >= questions.length - 1}
            />
          )}

          {step === "cheat-sheet" && cheatSheetData && (
            <CheatSheet data={cheatSheetData} sessionId={sessionId} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function generateFallbackAnalysis(): FallbackResult {
  const questions: InterviewQuestion[] = [
    {
      index: 0,
      question:
        "I notice you don't have much AWS experience listed. How have you handled cloud infrastructure in your previous roles?",
      tip: "Focus on your ability to learn fast and draw parallels to tools you've used.",
      category: "critical",
      gap_item_title: "Limited cloud infrastructure experience",
    },
    {
      index: 1,
      question:
        "Can you walk me through how you'd design a system that needs to handle 10x the current user load?",
      tip: "Think about the key principles: redundancy, caching, load balancing, and database scaling.",
      category: "critical",
      gap_item_title: "No mention of system design",
    },
    {
      index: 2,
      question:
        "Tell me about a specific improvement you made that had measurable business impact.",
      tip: "Use STAR format and include actual numbers or percentages.",
      category: "weak",
      gap_item_title: "Vague achievement metrics",
    },
    {
      index: 3,
      question:
        "Describe a time when you had to lead a team through a challenging project with tight deadlines.",
      tip: "Pick a story where your leadership made a clear difference in the outcome.",
      category: "weak",
      gap_item_title: "Limited leadership examples",
    },
    {
      index: 4,
      question:
        "Tell me about the most technically challenging project you've worked on and how you solved it.",
      tip: "This is your chance to shine - pick something that shows depth and problem-solving.",
      category: "strength",
      gap_item_title: "Strong technical foundation",
    },
    {
      index: 5,
      question:
        "How do you handle disagreements with product managers or designers about technical decisions?",
      tip: "Show you can balance technical excellence with business needs.",
      category: "strength",
      gap_item_title: "Cross-functional collaboration",
    },
    {
      index: 6,
      question:
        "Why are you interested in this role at our company specifically?",
      tip: "Research the company and connect your experience to their mission.",
      category: "strength",
      gap_item_title: "Strong technical foundation",
    },
  ];

  return {
    gapAnalysis: {
      critical: [
        {
          title: "Limited cloud infrastructure experience",
          description:
            "The job requires AWS but your resume focuses on on-premise solutions. Interviewers will probe this directly.",
          sample_question:
            "How have you handled cloud infrastructure and deployment in your previous roles?",
        },
        {
          title: "No mention of system design",
          description:
            "The role emphasizes designing scalable systems. Your resume doesn't showcase this.",
          sample_question:
            "Can you walk me through how you'd design a system that handles 10x the current traffic?",
        },
      ],
      weak: [
        {
          title: "Vague achievement metrics",
          description:
            "Phrases like 'improved efficiency' lack impact. Quantify with numbers.",
          sample_question:
            "Can you give me specific numbers on the improvements you mentioned?",
        },
        {
          title: "Limited leadership examples",
          description:
            "The role wants team leads. You have some but could strengthen these stories.",
          sample_question:
            "Tell me about a time you had to make a difficult decision for your team.",
        },
      ],
      strengths: [
        {
          title: "Strong technical foundation",
          description:
            "Your experience with modern frameworks and databases aligns perfectly with their tech stack.",
          sample_question:
            "Tell me about a technically challenging project you've completed.",
        },
        {
          title: "Cross-functional collaboration",
          description:
            "Your experience working with product and design teams is exactly what they're looking for.",
          sample_question:
            "How do you handle disagreements with product managers about technical decisions?",
        },
      ],
    },
    questions,
  };
}

function generateFallbackCheatSheet() {
  return {
    company: "Target Company",
    role: "Senior Engineer",
    likely_questions: [
      {
        question: "How have you handled cloud infrastructure?",
        answer_strategy: "Draw parallels between tools you know and AWS services",
      },
      {
        question: "Tell me about a time you managed a difficult team situation",
        answer_strategy: "Use STAR format, focus on the outcome and what you learned",
      },
      {
        question: "Why this role specifically?",
        answer_strategy: "Reference their recent work, mission, and how your skills align",
      },
    ],
    stories_to_tell: [
      {
        title: "The Efficiency Win",
        star_summary:
          "Situation: Legacy system slowing down deployment. Task: Modernize pipeline. Action: Implemented CI/CD and automated testing. Result: Reduced deployment time by 40%.",
      },
      {
        title: "The Team Challenge",
        star_summary:
          "Situation: Team morale low after failed sprint. Task: Rebuild confidence. Action: 1-on-1s, adjusted workload, celebrated small wins. Result: Delivered next sprint 15% ahead of target.",
      },
      {
        title: "The Tight Deadline",
        star_summary:
          "Situation: Client needed feature in 2 weeks instead of 6. Task: Prioritize and deliver. Action: Scoped MVP, parallelized workstreams, daily check-ins. Result: Delivered on time, client renewed contract.",
      },
    ],
    introduction:
      "I'm a backend engineer with 5 years of experience building scalable systems. I've led teams of up to 12 people and delivered projects that reduced operational costs by 30%. I'm excited about this role because it combines my passion for technical excellence with the kind of impactful work your team is doing.",
    keywords_to_drop: [
      "scalability",
      "resilience",
      "cost-optimization",
      "CI/CD",
      "microservices",
    ],
    questions_to_ask: [
      "What's the biggest technical challenge your team is facing right now?",
      "How do you measure success in this role in the first 90 days?",
      "What would you want the person in this role to do differently from their predecessor?",
    ],
  };
}
