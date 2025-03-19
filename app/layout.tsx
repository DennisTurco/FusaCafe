import { GeistSans } from 'geist/font/sans';
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from 'next';
import "/styles/global.scss";
import Head from 'next/head';

// Definizione dei metadati
export const metadata: Metadata = {
  title: "Fusa & Caffè | Cat Café a Parma - Relax e Caffè con i Gatti",
  description: "Scopri Fusa & Caffè, il primo Cat Café di Parma! Un luogo unico dove gustare un ottimo caffè in compagnia dei nostri gatti. Vieni a trovarci!",
  keywords: "caffè, fusa, gatti, caffetteria, relax, angolo caffè, esperienza caffè, gatti in caffetteria, caffè e animali, Parma",
  authors: [{ name: "Shard" }],
  openGraph: {
    title: "Fusa & Caffè - Relax e Caffè con i Gatti",
    description: "Fusa & Caffè è un angolo accogliente dove gustare il miglior caffè e rilassarti in compagnia dei nostri gatti. Un'esperienza unica nel cuore di Parma.",
    images: [{ url: "https://www.fusacafe.it/images/logo.png" }],
    url: "https://www.fusacafe.it",
    type: "website",
  },
  viewport: "width=device-width, initial-scale=1.0",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "name": "Fusa & Caffè",
    "url": "https://www.fusacafe.it",
    "logo": "https://www.fusacafe.it/images/logo.png",
    "image": "https://www.fusacafe.it/images/banner3.jpg",
    "description": "Un angolo accogliente per gustare caffè in compagnia di gatti a Parma.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Via D'Azeglio, 72",
      "addressLocality": "Parma",
      "postalCode": "43125",
      "addressCountry": "IT",
    },
    "telephone": "+39 123 456 7890",
    "sameAs": [
      "https://www.instagram.com/fusacafe_official",
      "https://www.facebook.com/fusacafeofficial",
    ],
  };

  return (
    <html lang="it">
      <body className={GeistSans.className} suppressHydrationWarning={true}>
        {/* Head for setting the favicon and structured data */}
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        </Head>

        {/* Rendering the page content */}
        {children}

        {/* Vercel Analytics integration */}
        <Analytics />
      </body>
    </html>
  );
}


{/* TODO: fixare i link di facebook e instagram */}