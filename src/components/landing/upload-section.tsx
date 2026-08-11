"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { Upload, FileText, ArrowRight, X, CheckCircle2 } from "lucide-react";

interface UploadSectionProps {
  onResumeUpload: (file: File, text: string) => void;
  onJobDescription: (text: string) => void;
  onStart: () => void;
}

export function UploadSection({ onResumeUpload, onJobDescription, onStart }: UploadSectionProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeParsed, setResumeParsed] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [parsing, setParsing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setResumeFile(file);
    setParsing(true);

    const text = await extractText(file);
    onResumeUpload(file, text);
    setResumeParsed(true);
    setParsing(false);
  }, [onResumeUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "text/plain": [".txt"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const extractText = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsText(file);
        return;
      }
      resolve(`[Resume: ${file.name}] — PDF text extraction will be handled by the server.`);
    });
  };

  const canStart = resumeParsed && jobDescription.trim().length > 20;

  return (
    <motion.div
      id="upload-section"
      className="scroll-mt-20 mx-auto w-full max-w-2xl px-4 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-bold">Let&apos;s get you prepared</h2>
        <p className="text-muted">Upload your resume and paste the job description</p>
      </div>

      <div className="space-y-6">
        <Card
          className={`relative cursor-pointer transition-all duration-300 ${
            isDragActive
              ? "border-primary ring-2 ring-primary/20"
              : resumeParsed
              ? "border-secondary/50"
              : "hover:border-primary/50"
          }`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                resumeParsed ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
              }`}
            >
              {resumeParsed ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : parsing ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Upload className="h-6 w-6" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {resumeParsed
                  ? resumeFile?.name
                  : isDragActive
                  ? "Drop your resume here..."
                  : "Upload your resume"}
              </p>
              <p className="text-sm text-muted">
                {resumeParsed
                  ? "Resume uploaded successfully"
                  : "PDF or TXT, max 10MB"}
              </p>
            </div>
            {resumeParsed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setResumeFile(null);
                  setResumeParsed(false);
                }}
                className="text-muted hover:text-accent"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </Card>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Job Description
          </label>
          <Textarea
            placeholder="Paste the full job description here...&#10;&#10;Include the role requirements, responsibilities, and company info for the best analysis."
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              onJobDescription(e.target.value);
            }}
            className="min-h-[200px]"
          />
          <p className="mt-1 text-xs text-muted">
            {jobDescription.length} characters •{" "}
            {jobDescription.length > 20 ? (
              <span className="text-secondary">Good length</span>
            ) : (
              <span>Paste more details for better results</span>
            )}
          </p>
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: canStart ? 1 : 0.5 }}
          className="flex justify-center pt-4"
        >
          <Button
            size="lg"
            onClick={onStart}
            disabled={!canStart}
            className="group w-full sm:w-auto"
          >
            {canStart ? (
              <>
                Analyze My Background
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Upload resume and paste job description
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
