// types/lesson.ts
export type Lesson = {
  id: number;
  language: string;
  title: string;
  description: string;
  content: Array<{
    type: string;
    content: string;
  }>;
  test: {
    question: string;
    code: string;
    expected_output: string;
  };
  courseId?: string; // Add this line
};