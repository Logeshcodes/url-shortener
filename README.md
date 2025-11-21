# URL Shortener

A full-featured URL shortening service with click tracking and analytics, built with Next.js 14, PostgreSQL, and Tailwind CSS.

## Features

- ✅ Create short links with custom codes (6-8 characters)
- ✅ Click tracking and statistics
- ✅ Link management dashboard
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Real-time click updates
- ✅ Copy to clipboard functionality
- ✅ Delete links with confirmation
- ✅ Health check endpoint for monitoring

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon recommended)
- **Hosting**: Vercel (recommended)

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Neon, Railway, or any PostgreSQL provider)
- npm or yarn package manager

## Setup

### 1. Clone Repository

```bash
git clone <repo-url>
cd url-shortener
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
BASE_URL=http://localhost:3000
NODE_ENV=development
PORT=3000
```

### 4. Setup Database

Connect to your PostgreSQL database and run the schema:

```bash
psql $DATABASE_URL < lib/schema.sql
```

Or manually execute the SQL from `lib/schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  last_clicked_at TIMESTAMP WITH TIME ZONE NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_links_code ON links(code);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at DESC);
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Create Link

```bash
POST /api/links
Content-Type: application/json

{
  "url": "https://example.com/very/long/url",
  "customCode": "docs"  // Optional
}
```

Response (201 Created):
```json
{
  "code": "docs",
  "url": "https://example.com/very/long/url",
  "shortUrl": "http://localhost:3000/docs",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

### List All Links

```bash
GET /api/links
```

Response (200 OK):
```json
{
  "links": [
    {
      "code": "docs",
      "url": "https://example.com/docs",
      "clicks": 42,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "lastClickedAt": "2025-01-20T14:22:00.000Z"
    }
  ]
}
```

### Get Link Stats

```bash
GET /api/links/:code
```

Response (200 OK):
```json
{
  "code": "docs",
  "url": "https://example.com/docs",
  "clicks": 42,
  "createdAt": "2025-01-15T10:30:00.000Z",
  "lastClickedAt": "2025-01-20T14:22:00.000Z"
}
```

### Delete Link

```bash
DELETE /api/links/:code
```

Response (200 OK):
```json
{
  "message": "Link deleted successfully"
}
```

### Redirect

```bash
GET /:code
```

Redirects to the target URL (302 Found).

### Health Check

```bash
GET /healthz
```

Response (200 OK):
```json
{
  "ok": true,
  "version": "1.0",
  "uptime": 3600,
  "timestamp": "2025-01-21T10:30:00.000Z"
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `BASE_URL`: Your Vercel URL (add after first deploy)
4. Deploy

After deployment, update the `BASE_URL` environment variable with your actual Vercel URL and redeploy.

### Database Setup (Neon)

1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project
4. Copy the connection string
5. Add it to your `.env.local` file (and Vercel environment variables)

## Project Structure

```
url-shortener/
├── app/
│   ├── api/
│   │   ├── links/
│   │   │   ├── route.ts              # GET, POST /api/links
│   │   │   └── [code]/
│   │   │       └── route.ts          # GET, DELETE /api/links/:code
│   │   └── healthz/
│   │       └── route.ts              # GET /healthz
│   ├── code/
│   │   └── [code]/
│   │       └── page.tsx              # Stats page
│   ├── [code]/
│   │   └── route.ts                  # Redirect handler
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Dashboard
│   └── globals.css                   # Global styles
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── CopyButton.tsx
│   ├── LinkForm.tsx
│   ├── LinkTable.tsx
│   └── LinkStats.tsx
├── lib/
│   ├── db.ts                         # Database connection
│   ├── utils.ts                      # Code generator
│   ├── validation.ts                 # URL/code validation
│   ├── timeUtils.ts                  # Time formatting
│   └── schema.sql                    # Database schema
├── types/
│   └── index.ts                      # TypeScript types
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Key Features Implementation

### URL Validation

- URLs must start with `http://` or `https://`
- Validated before saving to database

### Custom Codes

- Optional 6-8 alphanumeric characters
- Must match pattern: `[A-Za-z0-9]{6,8}`
- Must be unique (returns 409 Conflict if exists)
- If not provided, generates random code

### Click Tracking

- Atomic database operation prevents race conditions
- Updates both clicks count and timestamp in single query
- Returns 302 redirect (not 301)

### Status Codes

- `200 OK` - Successful GET, DELETE
- `201 Created` - Link created
- `302 Found` - Redirect (temporary)
- `400 Bad Request` - Invalid input
- `404 Not Found` - Link doesn't exist
- `409 Conflict` - Duplicate code

## Testing

### Manual Testing

1. Create a link with a custom code
2. Visit the short URL and verify redirect
3. Check that clicks increment
4. View link stats
5. Delete a link
6. Verify link no longer works after deletion

### Health Check

```bash
curl http://localhost:3000/healthz
```

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

