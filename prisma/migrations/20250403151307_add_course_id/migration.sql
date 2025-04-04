-- Add course_id column with default
ALTER TABLE "progress" ADD COLUMN "course_id" VARCHAR(50) NOT NULL DEFAULT 'python';

-- Remove default after adding
ALTER TABLE "progress" ALTER COLUMN "course_id" DROP DEFAULT;

-- Add new unique constraint
ALTER TABLE "progress" ADD CONSTRAINT "progress_user_lesson_course_unique" 
  UNIQUE (user_id, lesson_id, course_id);

-- Remove old constraint if exists
ALTER TABLE "progress" DROP CONSTRAINT IF EXISTS progress_user_lesson_unique;