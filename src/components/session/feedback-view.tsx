"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, RotateCcw } from "lucide-react";
import type { PracticeScores } from "@/lib/types";

interface FeedbackProps {
  scores: PracticeScores;
  improvements: string[];
  improvedAnswer: string;
  onTryAgain: () => void;
  onNext: () => void;
  isLast: boolean;
}

const scoreLabels: Record<keyof PracticeScores, { label: string; color: "primary" | "secondary" | "accent" | "warning" }> = {
  clarity: { label: "Clarity", color: "primary" },
  relevance: { label: "Relevance", color: "secondary" },
  structure: { label: "Structure", color: "warning" },
  confidence: { label: "Confidence", color: "primary" },
};

export function FeedbackView({ scores, improvements, improvedAnswer, onTryAgain, onNext, isLast }: FeedbackProps) {
  const avgScore = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto w-full max-w-2xl px-4 py-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
          <CheckCircle className="h-8 w-8 text-secondary" />
        </div>
        <h2 className="mb-2 text-2xl font-bold">Here&apos;s how you did</h2>
        <p className="text-muted">
          Overall score: <span className="font-bold text-foreground">{avgScore}/10</span>
        </p>
      </motion.div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(Object.entries(scores) as Array<[keyof PracticeScores, number]>).map(
          ([key, value], idx) => {
            const config = scoreLabels[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
              >
                <Card className="text-center">
                  <p className="mb-1 text-xs font-medium uppercase text-muted">
                    {config.label}
                  </p>
                  <p className="mb-2 text-2xl font-bold">{value}</p>
                  <Progress value={value} max={10} color={config.color} />
                </Card>
              </motion.div>
            );
          }
        )}
      </div>

      {improvements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <Card className="border-warning/30 bg-warning/5">
            <h3 className="mb-2 font-bold text-sm uppercase text-warning">
              Areas to improve
            </h3>
            <ul className="space-y-1">
              {improvements.map((imp, i) => (
                <li key={i} className="text-sm text-muted flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                  {imp}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <Card className="border-secondary/30 bg-secondary/5">
          <h3 className="mb-3 font-bold text-sm uppercase text-secondary">
            Improved answer
          </h3>
          <p className="text-sm leading-relaxed text-foreground/80">{improvedAnswer}</p>
        </Card>
      </motion.div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="secondary" onClick={onTryAgain} className="flex-1">
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Button onClick={onNext} className="flex-1 group">
          {isLast ? "See Your Cheat Sheet" : "Next Question"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </motion.div>
  );
}
