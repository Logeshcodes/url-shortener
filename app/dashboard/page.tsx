'use client';

import { useState, useEffect } from 'react';
import { Link2, Home, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import LinkForm from '@/components/LinkForm';
import LinkTable from '@/components/LinkTable';
import { SkeletonTable, SkeletonCard } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import type { Link as LinkType } from '@/types';

export default function Dashboard() {
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const fetchLinks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/links');
      
      if (!response.ok) throw new Error('Failed to load links');

      const data = await response.json();
      setLinks(data.links || []);
    } catch (err) {
      setError('Failed to load links. Please try again.');
      console.error(err);
      toast.error('Failed to load links. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  // slicing links
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentLinks = links.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(links.length / perPage);

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-6">
        <div className="w-full max-w-5xl">
          <SkeletonCard />
          <div className="mt-6">
            <SkeletonTable />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full text-center">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Links</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchLinks}>Retry</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Link2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">URL Shortener</h1>
                <p className="text-gray-600 text-sm md:text-base">Create and manage your short links</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="secondary" className="flex items-center gap-2">
                <Home className="w-4 h-4" /> Home
              </Button>
            </Link>
          </div>
        </header>

        <LinkForm onSuccess={fetchLinks} />

        <LinkTable links={currentLinks} onDelete={fetchLinks} />

        {/* --- RESPONSIVE PAGINATION --- */}
        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
          <button
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
            className="p-2 rounded-full border hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => changePage(i + 1)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white border text-gray-900 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
            className="p-2 rounded-full border hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
}
