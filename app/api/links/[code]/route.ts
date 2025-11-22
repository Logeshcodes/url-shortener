import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import type { Link } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;
    const codeLower = code.toLowerCase();

    const result = await pool.query(
      'SELECT code, url, clicks, created_at, last_clicked_at FROM links WHERE LOWER(code) = $1',
      [codeLower]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    const row = result.rows[0];
    const link: Link = {
      code: row.code,
      url: row.url,
      clicks: row.clicks,
      createdAt: row.created_at,
      lastClickedAt: row.last_clicked_at,
    };

    return NextResponse.json(link);
  } catch (error) {
    console.error('Get link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;
    const codeLower = code.toLowerCase();

    const result = await pool.query(
      'DELETE FROM links WHERE LOWER(code) = $1 RETURNING code',
      [codeLower]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Delete link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

