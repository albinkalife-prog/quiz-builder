"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { QuizService, QuizData } from "@/services/quiz.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Trash2, Eye, Plus } from "lucide-react";

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const data = await QuizService.getAll();
        setQuizzes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      await QuizService.delete(id);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch (error) {
      alert("Failed to delete quiz");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading quizzes...</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Quizzes</h1>
        <Link href="/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Create New
          </Button>
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No quizzes found. Create one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="truncate">{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Total Questions: {quiz.questions?.length || 0}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                {quiz.id && (
                  <>
                    <Link href={`/quizzes/${quiz.id}`} className="w-full">
                      <Button variant="secondary" className="w-full">
                        <Eye className="w-4 h-4 mr-2" /> View
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(quiz.id!)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
