const API_URL = "http://localhost:3000/quizzes";

export interface Question {
  id?: number;
  text: string;
  type: "boolean" | "input" | "checkbox";
  options?: string;
}

export interface QuizData {
  id?: number;
  title: string;
  questions: Question[];
}

export const QuizService = {
  getAll: async (): Promise<QuizData[]> => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch quizzes");
    return res.json();
  },

  getOne: async (id: string): Promise<QuizData> => {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch quiz");
    return res.json();
  },

  create: async (data: QuizData) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create quiz");
    return res.json();
  },

  delete: async (id: number) => {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete quiz");
    return res.json();
  },
};
