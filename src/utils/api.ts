import OpenAI from "openai";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const openai = new OpenAI({
  apiKey: '',
  dangerouslyAllowBrowser: true,
});

async function getModifiedText(prompt: string, inputText: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: inputText,
        },
      ],
      temperature: 0.7,
      max_tokens: 64,
      top_p: 1,
    });

    const modifiedText = response.choices[0].message?.content;
    return modifiedText || "";
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error("Failed to get modified text from OpenAI API.");
  }
}

export default getModifiedText;
