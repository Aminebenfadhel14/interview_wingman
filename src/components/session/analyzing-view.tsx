"use client";

import { motion } from "framer-motion";

interface AnalyzingViewProps {
  stage: string;
}

const stages = [
  "Reading your resume...",
  "Analyzing the job description...",
  "Finding gaps between your experience...",
  "Generating personalized questions...",
  "Almost ready...",
];

export function AnalyzingView({ stage }: AnalyzingViewProps) {
  const currentStageIdx = stages.findIndex((s) => s === stage);

  return (
    <div className="flex flex-col items-center justify-center py-32 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="mb-8 relative">
          <div className="h-16 w-16 mx-auto rounded-full border-4 border-border border-t-primary animate-spin" />
        </div>

        <h2 className="mb-2 text-xl font-bold">Analyzing your background...</h2>
        <p className="mb-8 text-muted">{stage}</p>

        <div className="mx-auto max-w-xs space-y-2">
          {stages.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: i <= currentStageIdx ? 1 : 0.3,
                x: 0,
              }}
              transition={{ delay: i * 0.3 }}
              className="flex items-center gap-2"
            >
              <div
                className={`h-1.5 w-1.5 rounded-full ${
                  i <= currentStageIdx ? "bg-secondary" : "bg-border"
                }`}
              />
              <span
                className={`text-xs ${
                  i <= currentStageIdx ? "text-foreground" : "text-muted"
                }`}
              >
                {s}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
