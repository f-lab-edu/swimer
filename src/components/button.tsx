'use client';

import Link from 'next/link';

export function LinksButton() {
  return (
    <Link
      href={`/detail`}
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

export function SaveVisitButton() {
  return (
    <Link
      href={`/visit`}
    >
        <svg className="text-blue-500 inline-flex items-center size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
          <path d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
        </svg>
    </Link>
  );
}
