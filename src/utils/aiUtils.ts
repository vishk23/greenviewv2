import { model, structuredModel } from "@services/firebase";

interface AISummaryResult {
  summary: string;
  structuredSummary: {
    strengths: Array<{ area: string; description: string }>;
    improvement: Array<{ area: string; description: string }>;
  };
  suggestedQuestions: string[];
}

/**
 * Generates a structured summary using the AI model
 */
const generateStructuredSummary = async (qaPairs: any) => {
  try {
    const chat = structuredModel.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: "Based on the provided quiz questions and answers, generate a JSON summary with 'strengths' and 'improvements' fields. Each item in these fields should have two elements: the name of the area and a description. Limit each list to a maximum of three items.",
            },
          ],
        },
      ],
      generationConfig: { maxOutputTokens: 300 },
    });

    const result = await chat.sendMessage(JSON.stringify(qaPairs));
    let structuredResponse = await result.response.text();

    // Remove any backticks and code block markers from the response
    if (structuredResponse.startsWith("```json")) {
      structuredResponse = structuredResponse.replace(/```json|```/g, "").trim();
    }

    const parsedResponse = JSON.parse(structuredResponse);

    // Enforce a maximum of 3 items for both strengths and improvement
    return {
      strengths: (parsedResponse.strengths || []).slice(0, 3),
      improvement: (parsedResponse.improvements || []).slice(0, 3),
    };
  } catch (error) {
    console.error("Error generating structured summary:", error);
    return { strengths: [], improvement: [] };
  }
};

/**
 * Generates AI summary, structured feedback, and suggested questions based on quiz answers
 */
export const generateAISummary = async (
  questions: { question: string; answers: string[] }[],
  answers: number[]
): Promise<AISummaryResult> => {
  const qaPairs = questions.map((q, i) => ({
    question: q.question,
    answer: q.answers[answers[i]],
  }));

  // Generate unstructured summary
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Generate a sustainability summary and suggestions based on the following quiz questions and answers.",
          },
        ],
      },
    ],
    generationConfig: { maxOutputTokens: 500 },
  });

  const summaryResult = await chat.sendMessage(JSON.stringify(qaPairs));
  const summary = await summaryResult.response.text();

  // Generate structured summary
  const structuredSummary = await generateStructuredSummary(qaPairs);

  // Generate potential questions
  const questionResult = await chat.sendMessage(
    "Based on the previous context, provide three practical questions that the user might want to ask a chatbot that is a sustainability expert. Only provide the questions."
  );
  const questionsText = await questionResult.response.text();

  const suggestedQuestions = questionsText
    .split("\n")
    .filter((q) => q.trim())
    .map((q) => q.substring(0, q.indexOf("?") + 1))
    .slice(0, 3);

  return {
    summary,
    structuredSummary,
    suggestedQuestions,
  };
}; 