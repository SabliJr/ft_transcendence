type WritingStyle =
  | "academic"
  | "casual"
  | "professional"
  | "friendly"
  | "bloggy";

interface PromptOptions {
  text: string;
  style: WritingStyle;
}

const buildPrompt = ({ text, style }: PromptOptions): string => {
  const toneInstructions: Record<WritingStyle, string> = {
    casual:
      "Rewrite the following so it sounds like a casual, friendly human wrote it. Avoid sounding robotic or overly formal.",
    professional:
      "Rewrite the following into a confident, clear, and professional tone suitable for workplace communication.",
    friendly:
      "Rewrite this with a warm, helpful, and conversational tone. Make it sound human and kind.",
    bloggy:
      "Rewrite this in an informal but informative blog-post style. Keep it fun but clear.",
    academic:
      "Rewrite the following in a formal, objective, and academically appropriate tone. Use precise language and maintain clarity, avoiding casual expressions.",
  };

  return `${toneInstructions[style]}\n\nText:\n"${text}"\n\nRewritten Version:`;
};

const preprocessText = (raw: string): string => {
  // Remove HTML tags
  let text = raw.replace(/<[^>]*>/g, "");

  // Normalize whitespace
  text = text.replace(/\s+/g, " ").trim();

  // Split into sentences (basic period-based split)
  const sentences = text.split(/(?<=[.!?])\s+/);
  const seen = new Set<string>();
  const uniqueSentences: string[] = [];

  for (let sentence of sentences) {
    const trimmed = sentence.trim();
    if (trimmed && !seen.has(trimmed.toLowerCase())) {
      seen.add(trimmed.toLowerCase());
      uniqueSentences.push(trimmed);
    }
  }

  //s Join them back
  return uniqueSentences.join(" ");
};

const buildHumanizerPrompt = (
  text: string,
  tone: string,
  english_region: string
): string => {
  const toneInstructions: Record<string, string> = {
    casual:
      "Use a casual, friendly tone. Avoid sounding robotic or overly formal.",
    professional:
      "Use a confident, clear, and professional tone suited for workplace communication.",
    friendly:
      "Use a warm, helpful, and conversational tone that feels human and kind.",
    bloggy:
      "Write in an informal but informative blog-post style. Keep it fun but clear.",
    academic:
      "Use a formal, objective, and academically appropriate tone. Be precise and avoid casual expressions.",
  };

  let readingGrads =
    tone === "casual" || tone === "friendly"
      ? "5th–8th grade"
      : "10th–12th grade";

  const bannedWords = [
    "delve",
    "digital age",
    "cutting-edge",
    "leverage",
    "proactive",
    "fast-paced",
    "game-changer",
    "quest",
    "realm",
    "landscape",
    "resilient",
    "unravel",
    "embark",
    "groundbreaking",
    "esteemed",
    "shed light",
    "intricate",
    "tapestry",
    "foster",
    "treasure trove",
    "testament",
    "peril",
    "pertinent",
    "synergy",
    "underscores",
    "empower",
    "unleash",
    "unlock",
    "endeavour",
    "enlightening",
    "cognizant",
    "holistic",
    "discern",
    "multifaceted",
    "nuanced",
    "underpinnings",
    "cultivate",
    "integral",
    "encompass",
    "elucidate",
  ];

  // "profound",
  //   "amplify",
  //   "folks",
  //   "crucial",
  //   "thrill",
  //   "pivotal",
  //   "deep understanding",
  //   "conceptualize",
  //   "resonate",
  //   "elevate",

  // - Use active voice and simple word choices(avoid 4 + syllable words when possible).
  // - NEVER, EVER, EVER use colons, semicolons, em dashes, or question marks, especially the em dash, NEVER use it.. Rewrite or split sentences instead.

  const toneGuideline = toneInstructions[tone.toLowerCase()] || "";

  return `
    You are an AI humanizer.
    Your job is to rewrite AI-generated text so it sounds natural, human-like, and fits English used in ${english_region}, while keeping the original meaning. ${toneGuideline} Keep it between ${readingGrads} reading level.

    Guidelines:
    - Use clear, everyday language. Only use technical words if needed.
    - Make sentence connections smooth and natural.
    - Vary sentence length and structure to avoid a robotic tone.
    - Use short sentences mostly, with some moderate-length ones for flow.
    - Avoid long, complex sentences and repetitive patterns.
    - Include small imperfections (e.g., casual phrasing, slight grammar quirks).
    
    - Combine related ideas naturally—don’t chop them into fragments.
    - Start each paragraph with a clear point, then support it.
    - Avoid conclusions or summaries; end the text as if the discussion continues.
    - Do NOT use these words unless absolutely necessary: ${bannedWords.join(
      ", "
    )}
    - Only return the rewritten version of the text—no notes, formatting, or explanations.

    Here is the text:
    ${text}
  `.trim();
};

export { preprocessText, buildPrompt, buildHumanizerPrompt };
