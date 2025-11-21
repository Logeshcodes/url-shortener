'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import LinkStats from '@/components/LinkStats';
import type { Link } from '@/types';

export default function StatsPage() {
  const router = useRouter();
  const params = useParams();
  const code = params?.code as string;
  const [link, setLink] = useState<Link | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!code) return;

    const fetchLink = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`/api/links/${code}`);

        if (response.status === 404) {
          setError('Link not found');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to load link');
        }

        const data: Link = await response.json();
        setLink(data);
      } catch (err) {
        setError('Failed to load link. Please try again.');
        console.error('Error fetching link:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLink();
  }, [code]);

  const handleDelete = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading link statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">404</h1>
          <p className="text-red-600 mb-4">{error || 'Link not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <LinkStats link={link} onDelete={handleDelete} />
      </div>
    </main>
  );
}

