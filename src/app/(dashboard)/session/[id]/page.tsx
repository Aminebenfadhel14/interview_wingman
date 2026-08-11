"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import {
  ArrowLeft,
  Download,
  Share2,
  BarChart3,
  Clock,
  Target,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

export default function SessionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to sessions
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">Senior Software Engineer</h1>
              <p className="text-muted">Google • July 20, 2026</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-3 gap-4">
            <Card className="text-center">
              <BarChart3 className="mx-auto mb-1 h-5 w-5 text-secondary" />
              <p className="text-2xl font-bold">7.5</p>
              <p className="text-xs text-muted">Avg Score</p>
            </Card>
            <Card className="text-center">
              <Target className="mx-auto mb-1 h-5 w-5 text-primary" />
              <p className="text-2xl font-bold">7</p>
              <p className="text-xs text-muted">Questions</p>
            </Card>
            <Card className="text-center">
              <MessageSquare className="mx-auto mb-1 h-5 w-5 text-warning" />
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-muted">Practiced</p>
            </Card>
          </div>

          <h3 className="mb-4 font-bold">Practice History</h3>
          <div className="space-y-3">
            {[
              { q: "Tell me about a time you managed a difficult team member", score: 8 },
              { q: "How have you handled cloud infrastructure?", score: 6 },
              { q: "Why are you interested in this role?", score: 9 },
            ].map((item, i) => (
              <Card key={i} className="flex items-center justify-between">
                <p className="text-sm flex-1 mr-4">{item.q}</p>
                <div className="flex items-center gap-1 font-bold text-secondary">
                  {item.score}/10
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
