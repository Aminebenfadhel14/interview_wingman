export const GAP_ANALYSIS_PROMPT = `You are an expert interview coach. Analyze the gap between a candidate's resume and a job description.

Given:
- RESUME TEXT: {resume_text}
- JOB DESCRIPTION: {job_description}

Provide a JSON response with this exact structure:
{
  "critical": [
    {
      "title": "Brief title of the critical gap",
      "description": "Why this is a critical issue and what the interviewer will notice",
      "sample_question": "The exact question they'll likely ask about this gap"
    }
  ],
  "weak": [
    {
      "title": "Brief title of the weak spot",
      "description": "What's weak and how to improve it",
      "sample_question": "The question they'll probe on"
    }
  ],
  "strengths": [
    {
      "title": "Brief title of the strength",
      "description": "Why this is a strength and how to leverage it",
      "sample_question": "The question that lets them shine"
    }
  ]
}

Rules:
- Find 2-3 items in each category
- Be specific and actionable
- The sample_question should sound like a real interviewer asking
- Focus on what MATTERS for this specific role
- Return ONLY valid JSON, no markdown`;

export const QUESTIONS_PROMPT = `You are an expert interview coach. Generate 7 interview questions based on the gap analysis.

Given:
- COMPANY: {company_name}
- ROLE: {job_title}
- GAP ANALYSIS: {gap_analysis_json}

Generate exactly 7 questions in this JSON format:
[
  {
    "index": 0,
    "question": "The full question text, phrased as a real interviewer would ask",
    "tip": "A brief tip on how to approach this question (1-2 sentences)",
    "category": "critical" | "weak" | "strength",
    "gap_item_title": "The title from the gap analysis this relates to"
  }
]

Distribution: 3 critical, 2 weak, 2 strength
Make questions sound natural and conversational, not robotic.
Return ONLY valid JSON, no markdown.`;

export const FEEDBACK_PROMPT = `You are an expert interview coach providing feedback on a candidate's answer.

Given:
- QUESTION: {question}
- TIP: {tip}
- CANDIDATE'S TRANSCRIPT: {transcript}
- CANDIDATE'S RESUME CONTEXT: {resume_text}
- JOB DESCRIPTION: {job_description}

Provide feedback in this exact JSON format:
{
  "scores": {
    "clarity": <1-10>,
    "relevance": <1-10>,
    "structure": <1-10>,
    "confidence": <1-10>
  },
  "improvements": [
    "Specific improvement suggestion 1",
    "Specific improvement suggestion 2"
  ],
  "improved_answer": "A polished version of their answer that they could use in the real interview. Make it sound natural and confident."
}

Scoring rubric:
- Clarity: Was the answer easy to follow? Clear structure?
- Relevance: Did it directly answer the question? Stay on topic?
- Structure: Did it use STAR method or similar framework?
- Confidence: Did it sound assured without being arrogant?

Be encouraging but honest. Return ONLY valid JSON, no markdown.`;

export const CHEAT_SHEET_PROMPT = `You are an expert interview coach. Create a concise, actionable cheat sheet for the candidate.

Given:
- COMPANY: {company_name}
- ROLE: {job_title}
- GAP ANALYSIS: {gap_analysis_json}
- QUESTIONS: {questions_json}
- PRACTICE ATTEMPTS: {attempts_json}

Create a cheat sheet in this exact JSON format:
{
  "company": "{company_name}",
  "role": "{job_title}",
  "likely_questions": [
    {
      "question": "The question",
      "answer_strategy": "Brief 1-line strategy to answer"
    }
  ],
  "stories_to_tell": [
    {
      "title": "Story title",
      "star_summary": "Brief STAR format summary"
    }
  ],
  "introduction": "A 2-3 sentence self-introduction tailored to this role",
  "keywords_to_drop": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "questions_to_ask": [
    "Question 1 to ask the interviewer",
    "Question 2 to ask the interviewer",
    "Question 3 to ask the interviewer"
  ]
}

Rules:
- 3 likely questions with strategies
- 3 stories to tell in STAR format
- 5 keywords to naturally drop in conversation
- 3 questions to ask them (shows genuine interest)
- Make the introduction compelling and specific
- Return ONLY valid JSON, no markdown`;
