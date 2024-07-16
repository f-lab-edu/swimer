'use client';

import Link from 'next/link';
import {PaperclicpIcon} from '@/ui/icon';

export default function SaveVisitButton({id}: {id: string}) {
  return (
    <Link href={`/visit/${id}`}>
      <PaperclicpIcon />
    </Link>
  );
}
