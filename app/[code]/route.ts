import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    // Update clicks and get URL atomically
    const result = await pool.query(
      `UPDATE links 
       SET clicks = clicks + 1, 
           last_clicked_at = CURRENT_TIMESTAMP 
       WHERE code = $1 
       RETURNING url`,
      [code]
    );

    if (result.rows.length === 0) {
      // Return 404 HTML page
      return new NextResponse(
        `<!DOCTYPE html>
<html>
<head>
  <title>404 - Link Not Found</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: #f5f5f5;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      font-size: 3rem;
      color: #333;
      margin: 0;
    }
    p {
      color: #666;
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>404</h1>
    <p>Link not found</p>
  </div>
</body>
</html>`,
        { 
          status: 404, 
          headers: { 'Content-Type': 'text/html' } 
        }
      );
    }

    const url = result.rows[0].url;

    // CRITICAL: Must be 302 redirect
    return NextResponse.redirect(url, 302);
  } catch (error) {
    console.error('Redirect error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

