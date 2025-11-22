'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, Trash2, ExternalLink, MousePointerClick, Clock, Link2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Button from './ui/Button';
import CopyButton from './ui/CopyButton';
import ConfirmDialog from './ui/ConfirmDialog';
import Input from './ui/Input';
import { formatRelativeTime } from '@/lib/timeUtils';
import type { Link } from '@/types';

interface LinkTableProps {
  links: Link[];
  onDelete: () => void;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function LinkTable({ links, onDelete }: LinkTableProps) {
  const router = useRouter();
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const [deleteCode, setDeleteCode] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredLinks = useMemo(() => {
    if (!debouncedSearch.trim()) return links;

    const query = debouncedSearch.toLowerCase();
    return links.filter((link) => {
      const codeMatch = link.code.toLowerCase().includes(query);
      const urlMatch = link.url.toLowerCase().includes(query);
      return codeMatch || urlMatch;
    });
  }, [links, debouncedSearch]);

  const handleDelete = async () => {
    if (!deleteCode) return;
  
    setDeletingCode(deleteCode);
  
    try {
      const response = await fetch(`/api/links/${deleteCode}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete link');
      }
  
      toast.success('Link deleted successfully');
      onDelete();
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link. Please try again.');
    } finally {
      setDeletingCode(null);
      setConfirmOpen(false);
    }
  };

  const truncateUrl = useCallback((url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  }, []);

  if (links.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-12 text-center border border-white/20">
        <Link2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-xl font-semibold text-gray-700 mb-2">No links yet!</p>
        <p className="text-gray-500">Create your first short link using the form above.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-white/20 mb-4">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by code or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Target URL
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <MousePointerClick className="w-4 h-4" />
                    Clicks
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Last Clicked
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No links found matching your search.
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link) => (
                  <tr
                    key={link.code}
                    className="hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <a
                        href={`/code/${link.code}`}
                        className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer flex items-center gap-2 group"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/code/${link.code}`);
                        }}
                      >
                        {link.code}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 max-w-md">
                        <span className="text-sm text-gray-900 truncate" title={link.url}>
                          {truncateUrl(link.url, 50)}
                        </span>
                        <CopyButton text={link.url} className="!p-1.5 !text-xs flex-shrink-0" />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                        <MousePointerClick className="w-4 h-4 text-blue-500" />
                        {link.clicks}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatRelativeTime(link.lastClickedAt)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <Button
                        variant="danger"
                        onClick={() => {
                          setDeleteCode(link.code);
                          setConfirmOpen(true);
                        }}
                        isLoading={deletingCode === link.code}
                        className="!py-1.5 !px-3 !text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {searchQuery && (
          <div className="px-4 py-2 bg-gray-50/80 text-sm text-gray-600 border-t border-gray-200">
            Showing {filteredLinks.length} of {links.length} links
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        message={`Do you really want to delete "${deleteCode}"?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

