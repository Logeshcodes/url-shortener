'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from './ui/Button';
import CopyButton from './ui/CopyButton';
import { formatDate } from '@/lib/timeUtils';
import type { Link } from '@/types';

interface LinkStatsProps {
  link: Link;
  onDelete: () => void;
}

export default function LinkStats({ link, onDelete }: LinkStatsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shortUrl = `${baseUrl}/${link.code}`;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this link?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/links/${link.code}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete link');
      }

      onDelete();
      router.push('/');
    } catch (error) {
      console.error('Error deleting link:', error);
      alert('Failed to delete link. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Link Statistics: {link.code}</h1>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short URL:
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="px-3 py-2 bg-gray-100 rounded-md text-sm font-mono break-all">
              {shortUrl}
            </code>
            <CopyButton text={shortUrl} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target URL:
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="px-3 py-2 bg-gray-100 rounded-md text-sm font-mono break-all">
              {link.url}
            </code>
            <CopyButton text={link.url} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-sm text-gray-600">Total Clicks</div>
            <div className="text-2xl font-bold text-blue-900">{link.clicks}</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl mb-1">📅</div>
            <div className="text-sm text-gray-600">Created</div>
            <div className="text-sm font-medium text-green-900">
              {formatDate(link.createdAt)}
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl mb-1">🕐</div>
            <div className="text-sm text-gray-600">Last Clicked</div>
            <div className="text-sm font-medium text-purple-900">
              {link.lastClickedAt ? formatDate(link.lastClickedAt) : 'Never'}
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <Button variant="secondary" onClick={() => router.push('/')}>
            ← Back to Dashboard
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
            Delete Link
          </Button>
        </div>
      </div>
    </div>
  );
}

