"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import {
  ArrowRight,
  Clock,
  FileText,
  BarChart3,
  Plus,
  Trash2,
} from "lucide-react";

const mockSessions = [
  {
    id: "1",
    company: "Google",
    role: "Senior Software Engineer",
    date: "2026-07-20",
    status: "completed",
    score: 7.5,
  },
  {
    id: "2",
    company: "Stripe",
    role: "Full Stack Developer",
    date: "2026-07-18",
    status: "completed",
    score: 8.2,
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold">Your Sessions</h1>
            <p className="text-muted">
              Track your interview preparation progress
            </p>
          </div>
          <Link href="/">
            <Button className="group">
              <Plus className="h-4 w-4" />
              New Session
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        {mockSessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="flex flex-col items-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-bold">No sessions yet</h3>
              <p className="mb-6 max-w-sm text-muted">
                Upload your resume and a job description to start your first
                interview prep session.
              </p>
              <Link href="/">
                <Button className="group">
                  Start Your First Session
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {mockSessions.map((session, idx) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.1 }}
              >
                <Link href={`/session/${session.id}`}>
                  <Card className="group cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
                          {session.company.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold group-hover:text-primary transition-colors">
                            {session.role}
                          </h3>
                          <p className="text-sm text-muted">
                            {session.company}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <div className="flex items-center gap-1 text-sm text-muted">
                            <Clock className="h-3.5 w-3.5" />
                            {session.date}
                          </div>
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <BarChart3 className="h-3.5 w-3.5 text-secondary" />
                            {session.score}/10
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
