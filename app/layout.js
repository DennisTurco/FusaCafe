import { GeistSans } from 'geist/font/sans';
import { Analytics } from "@vercel/analytics/react";
import Head from 'next/head'; 
import "/styles/global.scss";

// Definizione dei metadati
export const metadata = {
  title: "Fusa & Caffè",
  description: "Un angolo accogliente dove gustare il miglior caffè e rilassarti in compagnia dei nostri gatti.",
  keywords: "caffè, template, clienti, business, fusa",
  author: "Shard",
  ogTitle: "Fusa & Caffè",
  ogDescription: "Un angolo accogliente dove gustare il miglior caffè e rilassarti in compagnia dei nostri gatti.",
  ogImage: "/images/logo.png",
  // twitterCard: "summary_large_image",
  // twitterSite: "@fusa_caffe",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className={GeistSans.className} suppressHydrationWarning={true}>
        <Head>
          {/* Titolo della pagina */}
          <title>{metadata.title}</title>
          
          {/* Descrizione per i motori di ricerca */}
          <meta name="description" content={metadata.description} />

          {/* Metadati SEO */}
          <meta name="keywords" content={metadata.keywords} />
          <meta name="author" content={metadata.author} />

          {/* Open Graph (per la condivisione su social media come Facebook) */}
          <meta property="og:title" content={metadata.ogTitle} />
          <meta property="og:description" content={metadata.ogDescription} />
          <meta property="og:image" content={metadata.ogImage} />
          <meta property="og:type" content="website" />
          
          {/* Impostazioni della card Twitter */}
          {/* <meta name="twitter:card" content={metadata.twitterCard} />
          <meta name="twitter:site" content={metadata.twitterSite} />
          <meta name="twitter:title" content={metadata.ogTitle} />
          <meta name="twitter:description" content={metadata.ogDescription} />
          <meta name="twitter:image" content={metadata.ogImage} /> */}

          {/* Meta tag per la viewport */}
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />

          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* Rendering del contenuto della pagina */}
        {children}

        {/* Integrazione di Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
