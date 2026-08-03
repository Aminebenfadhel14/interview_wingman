export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  company: string | null;
  job_title: string | null;
  created_at: string;
  updated_at: string;
}

export interface GapAnalysis {
  critical: GapItem[];
  weak: GapItem[];
  strengths: GapItem[];
}

export interface GapItem {
  title: string;
  description: string;
  sample_question: string;
}

export interface InterviewQuestion {
  index: number;
  question: string;
  tip: string;
  category: "critical" | "weak" | "strength";
  gap_item_title: string;
}

export interface PracticeScores {
  clarity: number;
  relevance: number;
  structure: number;
  confidence: number;
}

export interface PracticeAttempt {
  id: string;
  session_id: string;
  question_index: number;
  audio_url: string | null;
  transcript: string | null;
  scores: PracticeScores | null;
  improved_answer: string | null;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  resume_file_url: string | null;
  resume_text: string | null;
  job_description_text: string | null;
  company_name: string | null;
  job_title: string | null;
  gap_analysis: GapAnalysis | null;
  questions: InterviewQuestion[] | null;
  cheat_sheet_url: string | null;
  status: "generated" | "practicing" | "completed";
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  stripe_payment_id: string;
  amount: number;
  status: string;
  session_id: string | null;
  created_at: string;
}

export type SessionStep = "upload" | "analyzing" | "gap-radar" | "practice" | "feedback" | "cheat-sheet";
