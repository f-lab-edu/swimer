'use client'

import Layout from "../../../components/detailLayout";
import { usePath } from "../../../lib/utils";

export default function Home() {
  return (
    <>
    <Layout id={usePath()}>
      <h1></h1>
    </Layout>
    </>
  );
}
