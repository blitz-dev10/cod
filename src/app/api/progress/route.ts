import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET /api/progress?userId=123&courseId=python
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const courseId = searchParams.get('courseId'); // Add course filter

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }

  try {
    const client = await pool.connect();
    const query = courseId 
      ? 'SELECT * FROM progress WHERE user_id = $1 AND course_id = $2'
      : 'SELECT * FROM progress WHERE user_id = $1';
    
    const params = courseId ? [userId, courseId] : [userId];
    
    const result = await client.query(query, params);
    client.release();
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

// POST /api/progress
export async function POST(request: Request) {
  const { userId, lessonId, courseId, completed, score } = await request.json();

  if (!userId || !lessonId || !courseId) {
    return NextResponse.json(
      { error: 'User ID, Lesson ID, and Course ID are required' },
      { status: 400 }
    );
  }

  try {
    const client = await pool.connect();
    
    const result = await client.query(`
      INSERT INTO progress (user_id, lesson_id, course_id, completed, score)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT ON CONSTRAINT progress_user_lesson_course_unique
      DO UPDATE SET 
        completed = EXCLUDED.completed, 
        score = EXCLUDED.score, 
        date_completed = CURRENT_TIMESTAMP
      RETURNING *
    `, [userId, lessonId, courseId, completed, score]);
    
    client.release();
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}