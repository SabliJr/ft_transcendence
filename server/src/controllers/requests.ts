import { Request, Response } from "express";
import {GPT_KEY,
  GEMINI_KEY,
  SONNET_KEY,
  DEEPSEEK_KEY,
  MISTRAL_KEY
} from "../constants"

import { GoogleGenAI } from "@google/genai";
const gGemini = new GoogleGenAI({ apiKey: GEMINI_KEY });
import OpenAI from "openai";
const oAIClient = new OpenAI({ apiKey: GPT_KEY }); // const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
interface iReqData {
  prompt: string;
  modelVersion: string;
  writingTone: string;
  length: string | null;
  additionalContext: string | null;
}

const onMakeRequest = async (req: Request, res: Response) => {
  let req_data: iReqData = req.body;

  console.log("The data:", req_data);

  try {
    let user_plan = "some plan"; // Replace with actual user plan logic

    // If the user has a pro plan, let them use the pro versions
    // Else give them the free version
    if (user_plan === "Premium" || user_plan === "Standard") {
      if (req_data.modelVersion === "GPT 4.1") {
        const result = await onCallGPT(req_data);
        return res.json(result);
      } else if (req_data.modelVersion === "Gemini 2.5 pro") {
        const result = await onCallGemini(req_data);
        return res.json(result);
      } else if (req_data.modelVersion === "Sonnet 3.7") {
        const result = await onCallCluade(req_data);
        return res.json(result);
      } else if (req_data.modelVersion === "DeepSeek Chat") {
        const result = await onCallDeepSeek(req_data);
        return res.json(result);
      } else if (req_data.modelVersion === "Mistral Large") {
        const result = await onCallMistral(req_data);
        return res.json(result);
      }
    } else {
      if (req_data.modelVersion === "GPT 4.1mini") {
        const result = await onCallFreeGPT(req_data);

        let outputText = "";
        for await (const event of result) {
          if ("text" in event && event.text) {
            outputText += event.text;
          } else if (
            "choices" in event &&
            Array.isArray(event.choices) &&
            event.choices.length > 0 &&
            event.choices[0]?.delta?.content
          ) {
            outputText += event.choices[0].delta.content;
          }
        }

        return res.json(outputText);
      } else if (req_data.modelVersion === "Gemini 2.5 Flash") {
        const result = await onCallFreeGemini(req_data);

        let outputText = "";
        for await (const event of result) {
          if ("text" in event && event.text) {
            outputText += event.text;
          } else if (
            "choices" in event &&
            Array.isArray(event.choices) &&
            event.choices.length > 0 &&
            event.choices[0]?.delta?.content
          ) {
            outputText += event.choices[0].delta.content;
          }
        }

        return res.json(outputText);
      }
    }

    res.status(400).json({ error: "Invalid model version or user plan" });
  } catch (error) {
    console.error("Error making request to a model:", error, req_data);
    res.status(500).json({
      error: "Something went wrong making the request, please try again!",
    });
  }
};

// Function to call GPT 4.1 (Pro)
const onCallGPT = async (req_data: iReqData) => {
  const response = await fetch("https://api.openai.com/v1/gpt-4.1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GPT_KEY}`, // Replace with your API key
    },
    body: JSON.stringify({
      prompt: req_data.prompt,
      tone: req_data.writingTone,
      length: req_data.length,
      context: req_data.additionalContext,
    }),
  });
  return response.json();
};

// Function to call GPT 4.1mini (Free)
const onCallFreeGPT = async (req_data: iReqData) => {
  const stream = await oAIClient.responses.create({
    model: "gpt-4.1",
    input: [
      {
        role: "user",
        content: req_data.prompt,
      },
    ],
    stream: true,
  });

  // let outputText = "";
  // for await (const event of stream) {
  //   if ("text" in event && event.text) {
  //     outputText += event.text;
  //   } else if (
  //     "choices" in event &&
  //     Array.isArray(event.choices) &&
  //     event.choices.length > 0 &&
  //     event.choices[0]?.delta?.content
  //   ) {
  //     outputText += event.choices[0].delta.content;
  //   }
  // }
  return stream;
};

// const onCallFreeGPT = async (req_data: iReqData) => {
// const response = await fetch("https://api.openai.com/v1/gpt-4.1mini", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${GPT_KEY}`, // Replace with your API key
//   },
//   body: JSON.stringify({
//     prompt: req_data.prompt,
//     tone: req_data.writingTone,
//     length: req_data.length,
//     context: req_data.additionalContext,
//   }),
// });
// return response.json();

//   const stream = await oAIClient.responses.create({
//     model: "gpt-4.1",
//     input: [
//       {
//         role: "user",
//         content: req_data.prompt,
//       },
//     ],
//     stream: true,
//   });

//   return stream;
// };

// Function to call Gemini 2.5 Pro
const onCallGemini = async (req_data: iReqData) => {
  const response = await fetch("https://api.google.com/v1/gemini-2.5-pro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GEMINI_KEY}`, // Replace with your API key
    },
    body: JSON.stringify({
      prompt: req_data.prompt,
      tone: req_data.writingTone,
      length: req_data.length,
      context: req_data.additionalContext,
    }),
  });
  return response.json();
};

// Function to call Gemini 2.5 Flash (Free)
const onCallFreeGemini = async (req_data: iReqData) => {
  const fullPrompt = `
    ${req_data.prompt}
    Tone: ${req_data.writingTone}
    Length: ${req_data.length}
    Context: ${req_data.additionalContext}
  `;

  console.log("The full prompt: ", fullPrompt);

  const response = await gGemini.models.generateContentStream({
    model: "gemini-2.0-flash",
    contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
  });

  return response;
};

// const onCallFreeGemini = async (req_data: iReqData) => {
//   const response = await fetch("https://api.google.com/v1/gemini-2.5-flash", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${GEMINI_KEY}`, // Replace with your API key
//     },
//     body: JSON.stringify({
//       prompt: req_data.prompt,
//       tone: req_data.writingTone,
//       length: req_data.length,
//       context: req_data.additionalContext,
//     }),
//   });
//   return response.json();
// };

// Function to call Claude (Sonnet 3.7)
const onCallCluade = async (req_data: iReqData) => {
  const response = await fetch("https://api.anthropic.com/v1/claude", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SONNET_KEY}`, // Replace with your API key
    },
    body: JSON.stringify({
      prompt: req_data.prompt,
      tone: req_data.writingTone,
      length: req_data.length,
      context: req_data.additionalContext,
    }),
  });
  return response.json();
};

// Function to call DeepSeek Chat
const onCallDeepSeek = async (req_data: iReqData) => {
  const response = await fetch("https://api.deepseek.com/v1/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_KEY}`, // Replace with your API key
    },
    body: JSON.stringify({
      prompt: req_data.prompt,
      tone: req_data.writingTone,
      length: req_data.length,
      context: req_data.additionalContext,
    }),
  });
  return response.json();
};

// Function to call Mistral Large
const onCallMistral = async (req_data: iReqData) => {
  const response = await fetch("https://api.mistral.com/v1/large", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MISTRAL_KEY}`, // Replace with your API key
    },
    body: JSON.stringify({
      prompt: req_data.prompt,
      tone: req_data.writingTone,
      length: req_data.length,
      context: req_data.additionalContext,
    }),
  });
  return response.json();
};

export { onMakeRequest };
