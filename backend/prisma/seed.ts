import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log(' Starting seeding...');

    await prisma.question.deleteMany();
    await prisma.quiz.deleteMany();

    console.log(' Database cleared.');

    const jsQuiz = await prisma.quiz.create({
        data: {
            title: 'JavaScript Fundamentals',
            questions: {
                create: [
                    {
                        text: 'Is JavaScript a single-threaded language?',
                        type: 'boolean',
                    },
                    {
                        text: 'Which keyword is used to declare a constant?',
                        type: 'input',
                    },
                    {
                        text: 'Which of the following are valid JS data types?',
                        type: 'checkbox',
                        options: 'String,Boolean,Number,Float',
                    },
                    {
                        text: 'What is the output of "2" + 2 in JavaScript?',
                        type: 'input',
                    },
                ],
            },
        },
    });

    const reactQuiz = await prisma.quiz.create({
        data: {
            title: 'React.js Basics',
            questions: {
                create: [
                    {
                        text: 'React uses a Virtual DOM.',
                        type: 'boolean',
                    },
                    {
                        text: 'Select built-in React Hooks:',
                        type: 'checkbox',
                        options: 'useState,useEffect,useAngular,useTable',
                    },
                ],
            },
        },
    });

    console.log(` Seeding finished.`);
    console.log(`Created quiz: ${jsQuiz.title} (ID: ${jsQuiz.id})`);
    console.log(`Created quiz: ${reactQuiz.title} (ID: ${reactQuiz.id})`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });