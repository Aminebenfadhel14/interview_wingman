"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { motion } from "framer-motion";
import { Zap, LogOut } from "lucide-react";

export function Navbar() {
  const { user, loading, signOut } = useAuth();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">Interview Wingman</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {loading ? null : user ? (
            <>
              <Link href="/dashboard">
                <span className="hidden text-sm font-medium text-muted hover:text-foreground sm:inline">
                  {user.name}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="gap-1.5"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
