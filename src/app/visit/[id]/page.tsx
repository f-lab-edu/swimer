'use client'

import Layout from "../../../components/writeLayout";
import { usePath } from "../../../lib/utils"

export default function Home() {
  return (
    <>
    <Layout id={usePath()}>
      <h1></h1>
    </Layout>
    </>
  );
}
