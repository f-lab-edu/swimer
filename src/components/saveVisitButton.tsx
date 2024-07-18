'use client';

import Link from 'next/link';
import {PaperclicpIcon} from '@/ui/icon';

export default function SaveVisitButton({
  swimmingPoolId,
}: {
  swimmingPoolId: string;
}) {
  return (
    <Link href={`/visit/${swimmingPoolId}`}>
      <PaperclicpIcon className="inline-flex items-center" />
    </Link>
  );
}
