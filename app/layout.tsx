import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "URL-Shortener",
  description: "A full-featured URL shortening service with click tracking and analytics",
  icons: {
    icon: [
      { url: "/ShorterLink.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/ShorterLink.png", type: "image/png", sizes: "180x180" },
    ],
    shortcut: [
      { url: "/ShorterLink.png" },
    ],
  },
};





export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#333',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}

