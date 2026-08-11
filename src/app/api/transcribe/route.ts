import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const question = formData.get("question") as string;
    const tip = formData.get("tip") as string;
    const resumeText = formData.get("resumeText") as string;
    const jobDescription = formData.get("jobDescription") as string;

    let transcript = "This is a sample transcript of the candidate's answer.";
    let scores = { clarity: 7, relevance: 7, structure: 6, confidence: 7 };
    let improvements = [
      "Try to use the STAR method for structure",
      "Include a specific metric or number",
    ];
    let improved_answer =
      "Here is an improved version of your answer that demonstrates better structure and specificity.";

    if (OPENAI_API_KEY && audioFile) {
      try {
        const whisperForm = new FormData();
        whisperForm.append("file", audioFile);
        whisperForm.append("model", "whisper-1");

        const whisperRes = await fetch(
          "https://api.openai.com/v1/audio/transcriptions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: whisperForm,
          }
        );

        if (whisperRes.ok) {
          const whisperData = await whisperRes.json();
          transcript = whisperData.text || transcript;
        }
      } catch (e) {
        console.error("Whisper error:", e);
      }

      try {
        const feedbackPrompt = `You are an expert interview coach.

QUESTION: ${question}
TIP: ${tip}
CANDIDATE'S ANSWER: ${transcript}
RESUME: ${resumeText}
JOB DESCRIPTION: ${jobDescription}

Provide feedback in JSON: {"scores": {"clarity": 1-10, "relevance": 1-10, "structure": 1-10, "confidence": 1-10}, "improvements": ["suggestion1", "suggestion2"], "improved_answer": "polished version"}
Return ONLY valid JSON.`;

        const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY!,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 2048,
            messages: [{ role: "user", content: feedbackPrompt }],
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const text = aiData.content?.[0]?.text || "";
          try {
            const parsed = JSON.parse(text);
            scores = parsed.scores || scores;
            improvements = parsed.improvements || improvements;
            improved_answer = parsed.improved_answer || improved_answer;
          } catch {}
        }
      } catch (e) {
        console.error("Feedback AI error:", e);
      }
    }

    return NextResponse.json({
      transcript,
      scores,
      improvements,
      improved_answer,
    });
  } catch (error) {
    console.error("Transcribe error:", error);
    return NextResponse.json({
      transcript: "Unable to transcribe audio.",
      scores: { clarity: 5, relevance: 5, structure: 5, confidence: 5 },
      improvements: ["Please try recording again"],
      improved_answer: "Please try recording your answer again.",
    });
  }
}
