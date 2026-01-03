export class CreateQuestionDto {
  text: string;
  type: string;
  options?: string;
}

export class CreateQuizDto {
  title: string;
  questions: CreateQuestionDto[];
}
