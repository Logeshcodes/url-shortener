'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from './ui/Button';
import CopyButton from './ui/CopyButton';
import { formatRelativeTime } from '@/lib/timeUtils';
import type { Link } from '@/types';

interface LinkTableProps {
  links: Link[];
  onDelete: () => void;
}

export default function LinkTable({ links, onDelete }: LinkTableProps) {
  const router = useRouter();
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) {
      return;
    }

    setDeletingCode(code);

    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete link');
      }

      onDelete();
    } catch (error) {
      console.error('Error deleting link:', error);
      alert('Failed to delete link. Please try again.');
    } finally {
      setDeletingCode(null);
    }
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  if (links.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-6xl mb-4">📎</div>
        <p className="text-xl text-gray-700 mb-2">No links yet!</p>
        <p className="text-gray-500">Create your first short link using the form above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target URL
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Clicked
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {links.map((link) => (
              <tr
                key={link.code}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <a
                    href={`/code/${link.code}`}
                    className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                  >
                    {link.code}
                  </a>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">
                      {truncateUrl(link.url)}
                    </span>
                    <CopyButton text={link.url} className="!p-1 !text-xs" />
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {link.clicks}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatRelativeTime(link.lastClickedAt)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(link.code)}
                    isLoading={deletingCode === link.code}
                    className="!py-1 !px-2 !text-xs"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

