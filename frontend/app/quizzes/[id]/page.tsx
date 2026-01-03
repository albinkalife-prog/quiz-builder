"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QuizService, QuizData } from "@/services/quiz.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckSquare, Type, ToggleLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      QuizService.getOne(params.id as string)
        .then(setQuiz)
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) return <div className="p-10 text-center">Loading details...</div>;
  if (!quiz) return <div className="p-10 text-center">Quiz not found</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => router.push("/quizzes")}
        className="mb-4 pl-0 hover:pl-2 transition-all"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
      </Button>

      <Card className="mb-8 border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="text-3xl">{quiz.title}</CardTitle>
          <p className="text-sm text-muted-foreground">Quiz ID: {quiz.id}</p>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">Questions Preview</h2>

        {quiz.questions.map((q, index) => (
          <Card key={index} className="bg-slate-50/50">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <span className="font-bold text-lg">
                  {index + 1}. {q.text}
                </span>
                <Badge variant="outline" className="w-fit capitalize flex items-center gap-1">
                  {q.type === "boolean" && <ToggleLeft size={14} />}
                  {q.type === "input" && <Type size={14} />}
                  {q.type === "checkbox" && <CheckSquare size={14} />}
                  {q.type}
                </Badge>
              </div>

              <div className="pl-4 border-l-2 border-slate-200 ml-1">
                {q.type === "boolean" && (
                  <div className="flex gap-6 text-sm">
                    <label className="flex items-center gap-2 cursor-not-allowed text-gray-600">
                      <input type="radio" disabled /> True
                    </label>
                    <label className="flex items-center gap-2 cursor-not-allowed text-gray-600">
                      <input type="radio" disabled /> False
                    </label>
                  </div>
                )}

                {q.type === "input" && (
                  <input
                    disabled
                    placeholder="User answer will be typed here..."
                    className="w-full p-2 text-sm border rounded bg-white text-gray-400 italic cursor-not-allowed"
                  />
                )}

                {q.type === "checkbox" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options ? (
                      q.options.split(",").map((opt, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-700 bg-white p-2 rounded border"
                        >
                          <div className="w-4 h-4 border rounded border-gray-400 bg-gray-100" />
                          {opt.trim()}
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-red-400">No options configured</span>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
