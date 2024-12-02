import { model, structuredModel } from "@services/firebase";

interface AISummaryResult {
  summary: string;
  structuredSummary: {
    strengths: Array<{ area: string; description: string }>;
    improvement: Array<{ area: string; description: string }>;
  };
  suggestedQuestions: string[];
}

const generateStructuredSummary = async (qaPairs: any) => {
  console.log('=== GENERATING STRUCTURED SUMMARY ===');
  console.log('Input Q&A pairs:', qaPairs);

  try {
    console.log('Creating AI chat instance...');
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

    console.log('Sending message to AI...');
    const result = await chat.sendMessage(JSON.stringify(qaPairs));
    const response = await result.response.text();
    console.log('Raw AI response:', response);

    let cleanedResponse = response;
    if (response.startsWith("```json")) {
      cleanedResponse = response.replace(/```json|```/g, "").trim();
      console.log('Cleaned JSON response:', cleanedResponse);
    }

    console.log('Parsing JSON response...');
    const parsedResponse = JSON.parse(cleanedResponse);
    console.log('Parsed response:', parsedResponse);

    const normalizedResponse = {
      strengths: (parsedResponse.strengths || []).slice(0, 3),
      improvement: (parsedResponse.improvements || []).slice(0, 3),
    };
    console.log('Final structured summary:', normalizedResponse);

    return normalizedResponse;
  } catch (error) {
    console.error("Error in generateStructuredSummary:", error);
    return { strengths: [], improvement: [] };
  }
};

export const generateAISummary = async (
  questions: { question: string; answers: string[] }[],
  answers: number[]
): Promise<AISummaryResult> => {
  console.log('=== GENERATING AI SUMMARY ===');
  console.log('Input:', { questions, answers });

  const qaPairs = questions.map((q, i) => ({
    question: q.question,
    answer: q.answers[answers[i]],
  }));
  console.log('Generated Q&A pairs:', qaPairs);

  try {
    // Generate unstructured summary
    console.log('1. Generating unstructured summary...');
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
    console.log('Generated summary:', summary);

    // Generate structured summary
    console.log('2. Generating structured summary...');
    const structuredSummary = await generateStructuredSummary(qaPairs);
    console.log('Generated structured summary:', structuredSummary);

    // Generate potential questions
    console.log('3. Generating suggested questions...');
    const questionResult = await chat.sendMessage(
      "Based on the previous context, provide three practical questions that the user might want to ask a chatbot that is a sustainability expert. Only provide the questions."
    );
    const questionsText = await questionResult.response.text();
    console.log('Raw questions response:', questionsText);

    const suggestedQuestions = questionsText
      .split("\n")
      .filter((q) => q.trim())
      .map((q) => q.substring(0, q.indexOf("?") + 1))
      .slice(0, 3);
    console.log('Processed suggested questions:', suggestedQuestions);

    const result = {
      summary,
      structuredSummary,
      suggestedQuestions,
    };
    console.log('=== FINAL AI SUMMARY RESULT ===', result);
    return result;
  } catch (error) {
    console.error("Error in generateAISummary:", error);
    throw error;
  }
}; 