// app/api/progress/reset/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: Request) {
  const { userId, courseId } = await request.json();

  if (!userId) {
    return NextResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }

  try {
    const client = await pool.connect();
    
    // Delete progress records (either all or for specific course)
    const query = courseId
      ? 'DELETE FROM progress WHERE user_id = $1 AND course_id = $2 RETURNING *'
      : 'DELETE FROM progress WHERE user_id = $1 RETURNING *';
    
    const params = courseId ? [userId, courseId] : [userId];
    
    const result = await client.query(query, params);
    client.release();
    
    return NextResponse.json({
      success: true,
      deletedCount: result.rowCount
    });
  } catch (error) {
    console.error('Error resetting progress:', error);
    return NextResponse.json(
      { error: 'Failed to reset progress' },
      { status: 500 }
    );
  }
}