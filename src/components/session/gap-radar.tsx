"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Shield, ArrowRight } from "lucide-react";
import type { GapAnalysis } from "@/lib/types";

interface GapRadarProps {
  analysis: GapAnalysis;
  onPractice: (type: "critical" | "weak" | "strength") => void;
  onContinue: () => void;
}

const sectionConfig = {
  critical: {
    icon: AlertTriangle,
    color: "accent",
    bgColor: "bg-accent/10",
    textColor: "text-accent",
    borderColor: "border-accent/30",
    label: "THEY'LL DEFINITELY ASK ABOUT",
    emoji: "",
  },
  weak: {
    icon: TrendingUp,
    color: "warning",
    bgColor: "bg-warning/10",
    textColor: "text-warning",
    borderColor: "border-warning/30",
    label: "WEAK SPOT",
    emoji: "",
  },
  strengths: {
    icon: Shield,
    color: "secondary",
    bgColor: "bg-secondary/10",
    textColor: "text-secondary",
    borderColor: "border-secondary/30",
    label: "STRENGTH TO LEVERAGE",
    emoji: "",
  },
};

export function GapRadar({ analysis, onPractice, onContinue }: GapRadarProps) {
  const sections: Array<{ key: "critical" | "weak" | "strengths"; items: typeof analysis.critical }> = [
    { key: "critical", items: analysis.critical },
    { key: "weak", items: analysis.weak },
    { key: "strengths", items: analysis.strengths },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-3xl px-4 py-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 text-center"
      >
        <h2 className="mb-2 text-2xl font-bold">Here&apos;s what I found...</h2>
        <p className="text-muted">
          Based on your resume vs. the job description
        </p>
      </motion.div>

      <div className="space-y-6">
        {sections.map((section, sectionIdx) => {
          const config = sectionConfig[section.key];
          const Icon = config.icon;

          return section.items.map((item, itemIdx) => (
            <motion.div
              key={`${section.key}-${itemIdx}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + sectionIdx * 0.2 + itemIdx * 0.1 }}
            >
              <Card
                className={`border-l-4 ${config.borderColor} hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bgColor}`}
                  >
                    <Icon className={`h-5 w-5 ${config.textColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className={`mb-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${config.bgColor} ${config.textColor}`}
                    >
                      {config.label}
                    </span>
                    <h3 className="mb-1 text-lg font-bold">{item.title}</h3>
                    <p className="mb-3 text-sm text-muted leading-relaxed">
                      {item.description}
                    </p>
                    <div className="rounded-lg bg-background/50 p-3 border border-border">
                      <p className="text-sm font-medium text-foreground/80 italic">
                        &ldquo;{item.sample_question}&rdquo;
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-3"
                      onClick={() =>
                        onPractice(
                          section.key === "strengths" ? "strength" : section.key
                        )
                      }
                    >
                      Practice This
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ));
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-10 flex justify-center"
      >
        <Button size="lg" onClick={onContinue} className="group">
          Continue to Practice
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
