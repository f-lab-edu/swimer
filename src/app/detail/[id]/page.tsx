'use client';

import Layout from '../../../components/detailLayout';
import {usePath} from '../../../lib/utils';

export default function Home() {
  return <Layout swimmingpool_id={usePath()}></Layout>;
}
