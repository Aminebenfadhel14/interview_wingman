"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Share2,
  Copy,
  CheckCircle,
  Target,
  MessageSquare,
  Key,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

interface CheatSheetData {
  company: string;
  role: string;
  likely_questions: Array<{ question: string; answer_strategy: string }>;
  stories_to_tell: Array<{ title: string; star_summary: string }>;
  introduction: string;
  keywords_to_drop: string[];
  questions_to_ask: string[];
}

interface CheatSheetProps {
  data: CheatSheetData;
  sessionId: string;
}

export function CheatSheet({ data, sessionId }: CheatSheetProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = `
INTERVIEW CHEAT SHEET
${data.company} | ${data.role}

LIKELY QUESTIONS:
${data.likely_questions.map((q, i) => `${i + 1}. ${q.question}\n   → ${q.answer_strategy}`).join("\n\n")}

STORIES TO TELL:
${data.stories_to_tell.map((s, i) => `${i + 1}. ${s.title}\n   ${s.star_summary}`).join("\n\n")}

YOUR INTRODUCTION:
${data.introduction}

KEYWORDS TO DROP:
${data.keywords_to_drop.join(", ")}

QUESTIONS TO ASK THEM:
${data.questions_to_ask.map((q, i) => `${i + 1}. ${q}`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto w-full max-w-3xl px-4 py-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
          <Sparkles className="h-8 w-8 text-secondary" />
        </div>
        <h2 className="mb-2 text-3xl font-bold">You&apos;re ready.</h2>
        <p className="text-muted">Here&apos;s your cheat sheet.</p>
      </motion.div>

      <Card className="mb-6 overflow-hidden">
        <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-lg font-bold">Your Interview Cheat Sheet</h3>
            <p className="text-sm text-muted">
              {data.company} | {data.role}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-accent" />
              <h4 className="font-bold text-sm uppercase text-accent">
                3 Questions They&apos;ll Ask
              </h4>
            </div>
            <div className="space-y-3">
              {data.likely_questions.map((q, i) => (
                <div key={i} className="rounded-lg bg-background/50 p-3 border border-border">
                  <p className="mb-1 text-sm font-medium">{q.question}</p>
                  <p className="text-xs text-muted flex items-center gap-1">
                    <span className="text-secondary">→</span> {q.answer_strategy}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <h4 className="font-bold text-sm uppercase text-primary">
                3 Stories to Tell (STAR)
              </h4>
            </div>
            <div className="space-y-3">
              {data.stories_to_tell.map((s, i) => (
                <div key={i} className="rounded-lg bg-background/50 p-3 border border-border">
                  <p className="mb-1 text-sm font-medium">{s.title}</p>
                  <p className="text-xs text-muted">{s.star_summary}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-secondary" />
              <h4 className="font-bold text-sm uppercase text-secondary">
                Your Perfect Introduction
              </h4>
            </div>
            <div className="rounded-lg bg-secondary/5 p-3 border border-secondary/20">
              <p className="text-sm leading-relaxed italic">{data.introduction}</p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="mb-3 flex items-center gap-2">
              <Key className="h-4 w-4 text-warning" />
              <h4 className="font-bold text-sm uppercase text-warning">
                5 Keywords to Drop
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.keywords_to_drop.map((kw, i) => (
                <span
                  key={i}
                  className="rounded-full bg-warning/10 border border-warning/30 px-3 py-1 text-xs font-medium text-warning"
                >
                  {kw}
                </span>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="mb-3 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-muted" />
              <h4 className="font-bold text-sm uppercase text-muted">
                3 Questions to Ask Them
              </h4>
            </div>
            <div className="space-y-2">
              {data.questions_to_ask.map((q, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-0.5 font-bold text-foreground/60">{i + 1}.</span>
                  {q}
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="secondary" onClick={copyToClipboard} className="flex-1">
          {copied ? (
            <>
              <CheckCircle className="h-4 w-4 text-secondary" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy to Clipboard
            </>
          )}
        </Button>
        <Button className="flex-1">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="secondary" className="flex-1">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </motion.div>
  );
}
