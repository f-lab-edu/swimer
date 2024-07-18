'use client';

import Link from 'next/link';
import {ArrowIcon} from '@/ui/icon';

export default function MoveDetailButton({
  swimmingPoolId,
}: {
  swimmingPoolId: string;
}) {
  return (
    <Link href={`/detail/${swimmingPoolId}`}>
      <p className="text-blue-500 inline-flex items-center mt-4">
        Learn More
        <ArrowIcon />
      </p>
    </Link>
  );
}
