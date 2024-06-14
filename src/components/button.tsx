'use client';

import Link from 'next/link';

export default function LinksButton({ id }: { id: string }) {
  return (
    <Link
      href={`/detail/${id}`}
    >
        <p className="text-blue-500 inline-flex items-center mt-4">Learn More
            <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
            </svg>
        </p>
    </Link>
  );
}
