'use client';

import Layout from '@/components/mypage';
import {usePath} from '@/lib/utils';

export default function Home() {
  return (
    <>
      <Layout uid={usePath()}>
        <h1></h1>
      </Layout>
    </>
  );
}
