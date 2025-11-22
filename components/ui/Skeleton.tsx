'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export default function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-gray-200';
  
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} />
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-white/20">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/80">
            <tr>
              {[1, 2, 3, 4, 5].map((i) => (
                <th key={i} className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-20" variant="text" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row} className="hover:bg-gray-50">
                {[1, 2, 3, 4, 5].map((cell) => (
                  <td key={cell} className="px-4 py-4">
                    <Skeleton className="h-4 w-full" variant="text" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/20">
      <Skeleton className="h-8 w-48 mb-4" variant="text" />
      <Skeleton className="h-4 w-full mb-2" variant="text" />
      <Skeleton className="h-4 w-3/4 mb-4" variant="text" />
      <Skeleton className="h-10 w-32" variant="rectangular" />
    </div>
  );
}

