"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, FileText } from "lucide-react";

function scrollToUpload() {
  const el = document.getElementById("upload-section");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          AI-Powered Interview Prep
        </motion.div>

        <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Your interview is in{" "}
          <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            3 days
          </span>
          .
          <br />
          Let&apos;s make sure you&apos;re ready.
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg text-muted sm:text-xl">
          Upload your resume and the job description. Get a personalized session
          with 7 questions they&apos;ll actually ask — plus feedback, scoring, and a
          printable cheat sheet.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="xl" onClick={scrollToUpload} className="group">
            Start Your Free Session
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-secondary" />
            Personalized gap analysis
          </span>
          <span className="flex items-center gap-1.5">
            <Upload className="h-4 w-4 text-primary" />
            Voice-scored practice
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-accent">★</span>
            Printable cheat sheet
          </span>
        </div>
      </motion.div>
    </section>
  );
}
