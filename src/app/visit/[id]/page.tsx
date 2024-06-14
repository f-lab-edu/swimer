'use client'

import Layout from "../../../components/writeLayout";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();
  const id = pathname.split('/').pop();

  return (
    <>
    <Layout id={id}>
      <h1></h1>
    </Layout>
    </>
  );
}
