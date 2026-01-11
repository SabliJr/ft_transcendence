import { Request, Response } from "express";
import { preprocessText, buildHumanizerPrompt } from "../util/generalUtils";
import { GPT_KEY } from "../constants";
import axios from "axios";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: GPT_KEY,
});

// Humanizer API URL - set this to your deployed API URL
const HUMANIZER_API_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-production-url.com/humanize"
    : "http://localhost:4242/humanize";

const onStyleHumanize = async (
  writing_tone: string,
  input_text: string
): Promise<string> => {
  let humanized_res: any = null;

  if (writing_tone.toLowerCase() === "academic") {
    console.log("The writing tone: ", writing_tone.toLowerCase());

    humanized_res = await axios.post(
      `${HUMANIZER_API_URL}/academic_humanizer`,
      {
        text: input_text,
        intensity: "heavy",
        iterations: 5,
        method: "academic_humanizer",
      }
    );
  } else if (writing_tone.toLowerCase() === "professional") {
    console.log("The writing tone: ", writing_tone.toLowerCase());

    humanized_res = await axios.post(
      `${HUMANIZER_API_URL}/professional_humanizer`,
      {
        text: input_text,
        intensity: "heavy",
        iterations: 5,
        method: "professional_humanizer",
      }
    );
  } else if (writing_tone.toLowerCase() === "casual") {
    console.log("The writing tone: ", writing_tone.toLowerCase());

    humanized_res = await axios.post(`${HUMANIZER_API_URL}/casual_humanizer`, {
      text: input_text,
      intensity: "heavy",
      iterations: 5,
      method: "casual_humanizer",
    });
  } else if (writing_tone.toLowerCase() === "friendly-professional") {
    console.log("The writing tone: ", writing_tone.toLowerCase());

    humanized_res = await axios.post(
      `${HUMANIZER_API_URL}/professional_friendly_humanizer`,
      {
        text: input_text,
        intensity: "heavy",
        iterations: 5,
        method: "professional_friendly_humanizer",
      }
    );
  }

  return humanized_res.data.humanized_text;
};

const onHumannize = async (req: Request, res: Response) => {
  let toHumanize = req.body.to_humanize || req.body;
  let { english_region, writing_tone, input_text } = toHumanize;

  // Add validation to prevent crashes
  // if (!input_text) {
  //   return res.status(400).json({
  //     message: "Missing required field: input_text",
  //   });
  // }

  // console.log(english_region, writing_tone, input_text);
  let cleanedText = preprocessText(input_text);
  const prompt = buildHumanizerPrompt(
    cleanedText,
    writing_tone.toLowerCase(),
    english_region
  );

  try {
    console.log("We are before all");
    // Call GPT to clean the text
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4.1-mini",
    //   temperature: 0.8,
    //   top_p: 0.9,
    //   frequency_penalty: 0.4,
    //   presence_penalty: 0.3,
    //   messages: [{ role: "user", content: prompt }],
    // });

    // const result = completion.choices[0].message.content;
    console.log("We are before th humanizer but after GPT");
    // Make request to the Humanizer API to humanize the text.
    // const rewriteRes = await axios.post(`${HUMANIZER_API_URL}/rewrite`, {
    //   text: cleanedText,
    //   iterations: 5,
    //   method: "human_rewriter",
    // });

    // console.log(rewriteRes.data.humanized_text);

    // const bypassResponse = await axios.post(`${HUMANIZER_API_URL}/bypass`, {
    //   text: rewriteRes.data.humanized_text,
    //   iterations: 5,
    //   method: "bypass",
    // });

    // Declare variable outside conditional blocks
    // const humanizeResponse = await axios.post(`${HUMANIZER_API_URL}/advanced`, {
    //   text: humanized_res?.data.humanized_text,
    //   iterations: 5,
    //   method: "advanced",
    // });

    // const humanizeResponse = await axios.post(HUMANIZER_API_URL, {
    //   text: cleanedText,
    //   use_synonyms: true,
    //   use_passive: true,
    //   style: writing_tone.toLowerCase(),
    //   enhanced_mode: true,
    //   transformation_intensity: "medium",
    // });


    let humanized_first_res = await onStyleHumanize(writing_tone, input_text);

    // console.log("going to advanced!");
    let make_human = await axios.post(`${HUMANIZER_API_URL}/advanced`, {
      text: humanized_first_res,
      intensity: "medium",
      iterations: 2,
      method: "advanced",
    });

    // humanized_res = await axios.post(`${HUMANIZER_API_URL}/naturalize`, {
    //   text: input_text,
    //   style: "mixed",
    //   intensity_multiplier: 1.5,
    // });

    let humanized_res = await axios.post(
      `${HUMANIZER_API_URL}/text_humanizer`,
      {
        text: make_human.data.humanized_text,
        style: "mixed",
        intensity_multiplier: 1.5,
      }
    );

    console.log("We passed the humanizer\n\n");
    // console.log(humanizeResponse.data);
    // Return the humanized text from the API
    res.json({
      message: "Text humanized successfully",
      data: humanized_res.data,
      // stats: humanizeResponse.data.stats,
    });
  } catch (openaiError) {
    res.status(500).json({
      message: "Failed to humanize text with both methods.",
    });
  }
};
// }

const onWrite = () => { };

const onTranslate = () => { }

const onWriteWebContent = () => {};

export { onWriteWebContent, onTranslate, onWrite, onHumannize };