# quiz-builder
A full-stack web application for creating, managing, and previewing custom quizzes. This project was developed as a Full-Stack JS Engineer technical assessment.

## 🚀 Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, Shadcn/UI, React Hook Form, Zod.
- **Backend:** Node.js (NestJS), TypeScript, Prisma ORM.
- **Database:** SQLite (used for easy local setup and portability).

---

## 🛠️ Getting Started

Follow these steps to get the project up and running on your local machine.

1.Backend Setup

cd backend
npm install

2.Run migrations and seed the database with sample data:

npx prisma migrate dev --name init
npx prisma db seed 

3.Start the server:

npm run start:dev
The API will be available at: http://localhost:3000.

4.Frontend Setup

cd frontend
npm install

5.Start the client:

npm run dev
The application will be available at: http://localhost:3001.

