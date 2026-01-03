import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  create(createQuizDto: CreateQuizDto) {
    return this.prisma.quiz.create({
      data: {
        title: createQuizDto.title,
        questions: {
          create: createQuizDto.questions,
        },
      },
      include: { questions: true },
    });
  }

  findAll() {
    return this.prisma.quiz.findMany({
      include: { questions: true },
    });
  }

  findOne(id: number) {
    return this.prisma.quiz.findUnique({
      where: { id },
      include: { questions: true },
    });
  }

  remove(id: number) {
    return this.prisma.quiz.delete({
      where: { id },
    });
  }
}
