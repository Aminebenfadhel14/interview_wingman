"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Mic,
  MicOff,
  Play,
  Square,
  ArrowRight,
  Lightbulb,
  ChevronLeft,
  RotateCcw,
} from "lucide-react";
import type { InterviewQuestion, PracticeScores } from "@/lib/types";

interface PracticeModeProps {
  questions: InterviewQuestion[];
  currentIdx: number;
  onNavigate: (index: number) => void;
  onAnswer: (questionIndex: number, audioBlob: Blob, transcript: string) => void;
  onComplete: () => void;
}

export function PracticeMode({ questions, currentIdx, onNavigate, onAnswer, onComplete }: PracticeModeProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [hasAnswer, setHasAnswer] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setHasAnswer(false);
    setTranscript("");
    setRecordTime(0);
    setIsRecording(false);
    setShowTip(false);
  }, [currentIdx]);

  const question = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setTranscript(
          "Your answer will be transcribed and scored by AI..."
        );
        setHasAnswer(true);
        onAnswer(currentIdx, blob, "pending_transcription");
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordTime(0);
      setTranscript("");
      setHasAnswer(false);

      timerRef.current = setInterval(() => {
        setRecordTime((prev) => {
          if (prev >= 120) {
            stopRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      alert("Microphone access is needed for voice practice.");
    }
  }, [currentIdx, onAnswer]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const categoryColors = {
    critical: "text-accent bg-accent/10 border-accent/30",
    weak: "text-warning bg-warning/10 border-warning/30",
    strength: "text-secondary bg-secondary/10 border-secondary/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto w-full max-w-2xl px-4 py-8"
    >
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between text-sm text-muted">
          <span>
            Question {currentIdx + 1} of {questions.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={currentIdx + 1} max={questions.length} color="primary" showGlow />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="mb-6">
            <div className="mb-4 flex items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${categoryColors[question.category]}`}
              >
                {question.category.toUpperCase()}
              </span>
            </div>

            <p className="mb-4 text-lg font-medium leading-relaxed">
              {question.question}
            </p>

            <button
              onClick={() => setShowTip(!showTip)}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary-light transition-colors"
            >
              <Lightbulb className="h-4 w-4" />
              {showTip ? "Hide tip" : "Show tip"}
            </button>

            <AnimatePresence>
              {showTip && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 rounded-lg bg-primary/5 border border-primary/20 p-3">
                    <p className="text-sm text-muted">{question.tip}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <div className="flex flex-col items-center gap-4">
            {!isRecording && !hasAnswer && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="xl"
                  onClick={startRecording}
                  className="h-20 w-20 rounded-full p-0 animate-pulse-glow"
                >
                  <Mic className="h-8 w-8" />
                </Button>
              </motion.div>
            )}

            {isRecording && (
              <div className="flex flex-col items-center gap-3">
                <div className="animate-waveform flex items-end gap-1 h-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} />
                  ))}
                </div>
                <p className="text-sm font-mono text-muted">{formatTime(recordTime)}</p>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="accent"
                    size="lg"
                    onClick={stopRecording}
                    className="gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Stop Recording
                  </Button>
                </motion.div>
              </div>
            )}

            {hasAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <Card className="bg-secondary/5 border-secondary/20">
                  <p className="text-sm text-muted mb-2">Your answer:</p>
                  <p className="text-sm leading-relaxed">{transcript}</p>
                </Card>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setHasAnswer(false);
                      setTranscript("");
                      setRecordTime(0);
                    }}
                    className="flex-1"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Try Again
                  </Button>
                  <Button
                    onClick={() => {
                      if (currentIdx < questions.length - 1) {
                        onNavigate(currentIdx + 1);
                      } else {
                        onComplete();
                      }
                    }}
                    className="flex-1"
                  >
                    {currentIdx < questions.length - 1 ? (
                      <>
                        Next Question
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      "Finish Practice"
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {currentIdx > 0 && !isRecording && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(currentIdx - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Question
          </Button>
        </div>
      )}
    </motion.div>
  );
}
