import { NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resumeText, jobDescription, type, gapAnalysis, questions } = body;

    if (type === "cheat-sheet") {
      const prompt = `Create a cheat sheet for a candidate interviewing for a role.

Company: Target Company
Role: Senior Engineer
Gap Analysis: ${JSON.stringify(gapAnalysis)}
Questions: ${JSON.stringify(questions)}

Return a JSON object with: company, role, likely_questions (3 with question + answer_strategy), stories_to_tell (3 with title + star_summary), introduction (2-3 sentences), keywords_to_drop (5 strings), questions_to_ask (3 strings). Return ONLY valid JSON.`;

      if (!ANTHROPIC_API_KEY) {
        return NextResponse.json({
          cheatSheet: generateFallbackCheatSheet(),
        });
      }

      const aiResponse = await callClaude(prompt);
      try {
        const cheatSheet = JSON.parse(aiResponse);
        return NextResponse.json({ cheatSheet });
      } catch {
        return NextResponse.json({
          cheatSheet: generateFallbackCheatSheet(),
        });
      }
    }

    const prompt = `You are an expert interview coach. Analyze the gap between a candidate's resume and a job description.

RESUME: ${resumeText}
JOB DESCRIPTION: ${jobDescription}

Provide TWO things in your response:
1. A gap analysis as JSON with keys "critical", "weak", "strengths" (each an array of {title, description, sample_question})
2. 7 interview questions as JSON array with {index, question, tip, category ("critical"/"weak"/"strength"), gap_item_title}

Return format: {"gapAnalysis": {...}, "questions": [...]}
Return ONLY valid JSON, no markdown.`;

    if (!ANTHROPIC_API_KEY) {
      const fallback = generateFullFallback();
      return NextResponse.json(fallback);
    }

    const aiResponse = await callClaude(prompt);

    try {
      const parsed = JSON.parse(aiResponse);
      return NextResponse.json({
        gapAnalysis: parsed.gapAnalysis,
        questions: parsed.questions,
        sessionId: crypto.randomUUID(),
      });
    } catch {
      const fallback = generateFullFallback();
      return NextResponse.json(fallback);
    }
  } catch (error) {
    console.error("Analyze error:", error);
    const fallback = generateFullFallback();
    return NextResponse.json(fallback);
  }
}

async function callClaude(prompt: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  return data.content?.[0]?.text || "";
}

function generateFullFallback() {
  return {
    gapAnalysis: {
      critical: [
        {
          title: "Limited cloud infrastructure experience",
          description:
            "The job requires AWS but your resume focuses on on-premise solutions.",
          sample_question:
            "How have you handled cloud infrastructure in your previous roles?",
        },
        {
          title: "No mention of system design",
          description:
            "The role emphasizes designing scalable systems.",
          sample_question:
            "Can you walk me through how you'd design a system that handles 10x traffic?",
        },
      ],
      weak: [
        {
          title: "Vague achievement metrics",
          description:
            "Phrases like 'improved efficiency' lack impact. Quantify with numbers.",
          sample_question:
            "Can you give me specific numbers on the improvements you mentioned?",
        },
        {
          title: "Limited leadership examples",
          description:
            "The role wants team leads. Strengthen your leadership stories.",
          sample_question:
            "Tell me about a time you made a difficult decision for your team.",
        },
      ],
      strengths: [
        {
          title: "Strong technical foundation",
          description:
            "Your experience with modern frameworks aligns with their tech stack.",
          sample_question:
            "Tell me about a technically challenging project you've completed.",
        },
        {
          title: "Cross-functional collaboration",
          description:
            "Your experience working with product and design teams is exactly what they need.",
          sample_question:
            "How do you handle disagreements with product managers?",
        },
      ],
    },
    questions: [
      {
        index: 0,
        question:
          "How have you handled cloud infrastructure in your previous roles?",
        tip: "Focus on your ability to learn fast and draw parallels to tools you've used.",
        category: "critical",
        gap_item_title: "Limited cloud infrastructure experience",
      },
      {
        index: 1,
        question:
          "Can you walk me through how you'd design a system that needs to handle 10x the current user load?",
        tip: "Think about redundancy, caching, load balancing, and database scaling.",
        category: "critical",
        gap_item_title: "No mention of system design",
      },
      {
        index: 2,
        question:
          "Tell me about a specific improvement you made that had measurable business impact.",
        tip: "Use STAR format and include actual numbers or percentages.",
        category: "weak",
        gap_item_title: "Vague achievement metrics",
      },
      {
        index: 3,
        question:
          "Describe a time you led a team through a challenging project with tight deadlines.",
        tip: "Pick a story where your leadership made a clear difference.",
        category: "weak",
        gap_item_title: "Limited leadership examples",
      },
      {
        index: 4,
        question:
          "Tell me about the most technically challenging project you've worked on.",
        tip: "This is your chance to shine - pick something that shows depth.",
        category: "strength",
        gap_item_title: "Strong technical foundation",
      },
      {
        index: 5,
        question:
          "How do you handle disagreements with product managers about technical decisions?",
        tip: "Show you balance technical excellence with business needs.",
        category: "strength",
        gap_item_title: "Cross-functional collaboration",
      },
      {
        index: 6,
        question: "Why are you interested in this role at our company?",
        tip: "Research the company and connect your experience to their mission.",
        category: "strength",
        gap_item_title: "Strong technical foundation",
      },
    ],
    sessionId: crypto.randomUUID(),
  };
}

function generateFallbackCheatSheet() {
  return {
    company: "Target Company",
    role: "Senior Engineer",
    likely_questions: [
      {
        question: "How have you handled cloud infrastructure?",
        answer_strategy:
          "Draw parallels between tools you know and AWS services",
      },
      {
        question: "Tell me about a time you managed a difficult team",
        answer_strategy: "Use STAR format, focus on outcome and learnings",
      },
      {
        question: "Why this role specifically?",
        answer_strategy:
          "Reference their recent work, mission, and your alignment",
      },
    ],
    stories_to_tell: [
      {
        title: "The Efficiency Win",
        star_summary:
          "Situation: Legacy system slowing deployment. Task: Modernize pipeline. Action: Implemented CI/CD. Result: Reduced deployment time by 40%.",
      },
      {
        title: "The Team Challenge",
        star_summary:
          "Situation: Low morale after failed sprint. Action: 1-on-1s, adjusted workload. Result: Next sprint 15% ahead of target.",
      },
      {
        title: "The Tight Deadline",
        star_summary:
          "Situation: Client needed feature in 2 weeks. Action: Scoped MVP, parallelized work. Result: Delivered on time, contract renewed.",
      },
    ],
    introduction:
      "I'm a backend engineer with 5 years of experience building scalable systems. I've led teams of up to 12 and delivered projects that reduced costs by 30%. I'm excited about this role because it combines technical excellence with impactful work.",
    keywords_to_drop: [
      "scalability",
      "resilience",
      "cost-optimization",
      "CI/CD",
      "microservices",
    ],
    questions_to_ask: [
      "What's the biggest technical challenge your team faces right now?",
      "How do you measure success in this role in the first 90 days?",
      "What do you wish the last person in this role did differently?",
    ],
  };
}
