export interface MyScore {
  id: string;
  score: number;
  scoreHistory: {
    answers: string[];
    date: Date;
    questions: string[];
  }[];
  structuredSummary: {
    improvement: {
      area: string;
      description: string;
    }[];
    strengths: {
      area: string;
      description: string;
    }[];
  };
  userId: string;
}
