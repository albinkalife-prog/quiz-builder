import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuizCardProps {
  id: number;
  title: string;
  onDelete: (id: number) => void;
}

export function QuizCard({ id, title, onDelete }: QuizCardProps) {
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="truncate">{title}</CardTitle>
        <CardDescription>ID: {id}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">Questions count: (coming soon)</p>
      </CardContent>
      <CardFooter className="flex justify-between gap-4">
        <Button variant="outline" className="flex-1">
          Start
        </Button>
        <Button variant="destructive" onClick={() => onDelete(id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
