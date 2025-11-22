'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, BarChart3, Calendar, Clock, Link2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from './ui/Button';
import CopyButton from './ui/CopyButton';
import { formatDate } from '@/lib/timeUtils';
import type { Link } from '@/types';
import ConfirmDialog from './ui/ConfirmDialog';

interface LinkStatsProps {
  link: Link;
  onDelete: () => void;
}

export default function LinkStats({ link, onDelete }: LinkStatsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shortUrl = `${baseUrl}/${link.code}`;

  const handleDelete = async () => {
    setIsDeleting(true);
  
    try {
      const response = await fetch(`/api/links/${link.code}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete link');
      }
  
      toast.success('Link deleted successfully');
      onDelete();
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link. Please try again.');
      setIsDeleting(false);
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 md:p-8 border border-white/20">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Link2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Link Statistics</h1>
            <p className="text-gray-600 mt-1 font-mono text-sm">{link.code}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Short URL
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="px-4 py-2.5 bg-white/80 backdrop-blur-sm rounded-lg text-sm font-mono break-all border border-gray-200 flex-1 min-w-0">
              {shortUrl}
            </code>
            <CopyButton text={shortUrl} />
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white transition-colors"
              aria-label="Open link"
            >
              <ExternalLink className="w-4 h-4 text-gray-600" />
            </a>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Target URL
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="px-4 py-2.5 bg-white/80 backdrop-blur-sm rounded-lg text-sm font-mono break-all border border-gray-200 flex-1 min-w-0">
              {link.url}
            </code>
            <CopyButton text={link.url} />
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white transition-colors"
              aria-label="Open link"
            >
              <ExternalLink className="w-4 h-4 text-gray-600" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm font-medium text-blue-700">Total Clicks</div>
            </div>
            <div className="text-3xl font-bold text-blue-900">{link.clicks}</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm font-medium text-green-700">Created</div>
            </div>
            <div className="text-sm font-semibold text-green-900">
              {formatDate(link.createdAt)}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm font-medium text-purple-700">Last Clicked</div>
            </div>
            <div className="text-sm font-semibold text-purple-900">
              {link.lastClickedAt ? formatDate(link.lastClickedAt) : 'Never'}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <Button variant="secondary" onClick={() => router.push('/dashboard')} className="flex-1 sm:flex-initial">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Button variant="danger" onClick={() => setConfirmOpen(true)} isLoading={isDeleting} className="flex-1 sm:flex-initial">
            <Trash2 className="w-4 h-4" />
            Delete Link
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        message={`Do you really want to delete "${link.code}"?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

