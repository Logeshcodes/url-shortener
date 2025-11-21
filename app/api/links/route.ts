import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { isValidUrl, isValidCode } from '@/lib/validation';
import { generateShortCode } from '@/lib/utils';
import type { CreateLinkRequest, CreateLinkResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const body: CreateLinkRequest = await request.json();
    const { url, customCode } = body;

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Determine code
    let code = customCode;
    if (code) {
      // Validate custom code
      if (!isValidCode(code)) {
        return NextResponse.json(
          { error: 'Code must be 6-8 alphanumeric characters' },
          { status: 400 }
        );
      }
    } else {
      // Generate random code
      code = generateShortCode();
    }

    // Check if code exists
    const existing = await pool.query(
      'SELECT code FROM links WHERE code = $1',
      [code]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: `Short code '${code}' already exists` },
        { status: 409 }
      );
    }

    // Insert link
    const result = await pool.query(
      'INSERT INTO links (code, url) VALUES ($1, $2) RETURNING code, url, created_at',
      [code, url]
    );

    const link = result.rows[0];
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    const response: CreateLinkResponse = {
      code: link.code,
      url: link.url,
      shortUrl: `${baseUrl}/${link.code}`,
      createdAt: link.created_at,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Create link error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT code, url, clicks, created_at, last_clicked_at FROM links ORDER BY created_at DESC'
    );

    return NextResponse.json({
      links: result.rows.map((row) => ({
        code: row.code,
        url: row.url,
        clicks: row.clicks,
        createdAt: row.created_at,
        lastClickedAt: row.last_clicked_at,
      })),
    });
  } catch (error) {
    console.error('List links error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
