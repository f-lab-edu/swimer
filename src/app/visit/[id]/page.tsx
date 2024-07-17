'use client';

import Layout from '@/components/writeLayout';
import {usePath} from '@/lib/utils';

export default function Home() {
  return <Layout swimmingPoolId={usePath()}></Layout>;
}
