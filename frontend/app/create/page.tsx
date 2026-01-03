"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  useFieldArray,
  useWatch,
  Control,
  FieldErrors,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { QuizService } from "@/services/quiz.service";
import {ArrowLeft, PlusCircle, Trash2} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const quizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 chars"),
  questions: z
    .array(
      z
        .object({
          text: z.string().min(5, "Question text required"),
          type: z.enum(["boolean", "input", "checkbox"]),
          options: z.array(z.object({ value: z.string() })).optional(),
        })
        .superRefine((data, ctx) => {
          if (data.type === "checkbox") {
            const validOptions = data.options?.filter((opt) => opt.value.trim() !== "");

            if (!validOptions || validOptions.length < 2) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "MISSING_OPTIONS",
                path: ["options"],
              });
            }
          }
        })
    )
    .min(1, "Add at least one question"),
});

type QuizFormValues = z.infer<typeof quizSchema>;

export default function CreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      questions: [{ text: "", type: "boolean", options: [{ value: "" }, { value: "" }] }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "questions" });
  const questionsValues = useWatch({ control, name: "questions" });

  const onError = (errors: FieldErrors<QuizFormValues>) => {
    const isOptionsMissing =
      Array.isArray(errors.questions) && errors.questions.some((q: any) => q?.options);

    if (isOptionsMissing) {
      toast.error("Options Missing!", {
        description: "Multiple Choice questions need at least 2 options.",
      });
    } else if (errors.title) {
      toast.error("Missing Title", {
        description: errors.title.message,
      });
    } else {
      toast.error("Form Error", {
        description: "Please check all required fields.",
      });
    }
  };

  const onSubmit = async (data: QuizFormValues) => {
    setLoading(true);
    try {
      const formattedData = {
        ...data,
        questions: data.questions.map((q) => ({
          ...q,
          options:
            q.type === "checkbox"
              ? q.options
                  ?.map((opt) => opt.value)
                  .filter((v) => v !== "")
                  .join(",")
              : undefined,
        })),
      };
      await QuizService.create(formattedData);
      router.push("/quizzes");
    } catch (error) {
      alert("Error creating quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50/50">
      <div className="w-full max-w-2xl container mx-auto">
          <Button
              variant="ghost"
              onClick={() => router.push("/quizzes")}
              className="mb-4 pl-0 hover:pl-2 transition-all self-start text-gray-500 hover:text-gray-900"
          >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Quizzes
          </Button>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create Quiz ✍️</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
              <div>
                <Label className="mb-1 block">Quiz Title</Label>
                <Input {...register("title")} placeholder="e.g. JavaScript Basics" />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-6">
                {fields.map((field, index) => {
                  const hasOptionError = !!errors.questions?.[index]?.options;
                  const currentType = questionsValues?.[index]?.type;
                  return (
                    <div key={field.id} className="p-4 border rounded bg-slate-50 relative">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold bg-white px-2 py-1 rounded border">
                          Question {index + 1}
                        </span>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => remove(index)}
                            className="h-7 px-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <Input
                          {...register(`questions.${index}.text` as const)}
                          placeholder="Type your question here..."
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-gray-500 mb-1 block">Answer Type</Label>
                            <Controller
                              control={control}
                              name={`questions.${index}.type` as const}
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger className="w-full bg-background">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="boolean">True / False</SelectItem>
                                    <SelectItem value="input">Text Input</SelectItem>
                                    <SelectItem value="checkbox">Multiple Choice</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>
                        </div>

                        {currentType === "checkbox" && (
                          <div
                            className={`mt-4 p-3 bg-white rounded border transition-colors ${hasOptionError ? "border-red-500 ring-1 ring-red-500 bg-red-50" : ""}`}
                          >
                            {" "}
                            <Label className="text-xs text-gray-500 mb-2 block">
                              Answer Options
                            </Label>
                            <OptionsList nestIndex={index} control={control} register={register} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => append({ text: "", type: "boolean", options: [{ value: "" }] })}
                className="w-full py-6 border-dashed"
              >
                + Add New Question
              </Button>

              <Button type="submit" disabled={loading} className="w-full py-6 text-lg">
                {loading ? "Saving..." : "Create Quiz"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function OptionsList({
  nestIndex,
  control,
  register,
}: {
  nestIndex: number;
  control: Control<any>;
  register: any;
}) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `questions.${nestIndex}.options`,
  });

  return (
    <div className="space-y-2">
      {fields.map((item, k) => (
        <div key={item.id} className="flex gap-2 items-center">
          <div className="w-4 h-4 border-2 border-gray-300 rounded-sm flex-shrink-0" />

          <Input
            {...register(`questions.${nestIndex}.options.${k}.value`)}
            placeholder={`Option ${k + 1}`}
            className="h-8 text-sm"
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => remove(k)}
            className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => append({ value: "" })}
        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
      >
        <PlusCircle className="w-3 h-3" /> Add Option
      </Button>
    </div>
  );
}
