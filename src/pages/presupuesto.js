import Head from "next/head";
import CarrotPlayPropuesta from "@/components/CarrotPlayPropuesta";

export default function Presupuesto() {
  return (
    <>
      <Head>
        <title>CarrotPlay · Propuesta de diseño</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,301,400,401,700,701,900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <CarrotPlayPropuesta />
    </>
  );
}
