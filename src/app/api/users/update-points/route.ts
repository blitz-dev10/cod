import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST /api/users/update-points
export async function POST(request: Request) {
  const { userId, points } = await request.json();

  if (!userId || points === undefined) {
    return NextResponse.json(
      { error: 'User ID and points are required' },
      { status: 400 }
    );
  }

  try {
    const client = await pool.connect();
    
    // Update user's points
    const result = await client.query(`
      UPDATE users
      SET points = points + $1
      WHERE id = $2
      RETURNING *
    `, [points, userId]);
    
    client.release();
    
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating points:', error);
    return NextResponse.json(
      { error: 'Failed to update points' },
      { status: 500 }
    );
  }
}