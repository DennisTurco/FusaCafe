import { GeistSans } from 'geist/font/sans';
import { Analytics } from "@vercel/analytics/react";
import Head from 'next/head'; 
import "/styles/global.scss";

// Definizione dei metadati
export const metadata = {
  title: "Fusa & Caffè - Il Miglior Caffè e Relax con i Gatti",
  description: "Fusa & Caffè è un angolo accogliente dove gustare il miglior caffè e rilassarti in compagnia dei nostri gatti. Un'esperienza unica nel cuore di Parma.",
  keywords: "caffè, fusa, gatti, caffetteria, relax, angolo caffè, esperienza caffè, gatti in caffetteria, caffè e animali, Parma",
  author: "Shard",
  ogTitle: "Fusa & Caffè - Il Miglior Caffè e Relax con i Gatti",
  ogDescription: "Fusa & Caffè è un angolo accogliente dove gustare il miglior caffè e rilassarti in compagnia dei nostri gatti. Un'esperienza unica nel cuore di Parma.",
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
          
          {/* Meta tag per la viewport */}
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />

          {/* Aggiungi il tag canonical per evitare contenuti duplicati */}
          <link rel="canonical" href="https://www.fusacafe.it" />

          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />

          {/* Schema.org per SEO locale */}
          <script type="application/ld+json">
            {`
              {
                "@context": "http://schema.org",
                "@type": "CafeOrCoffeeShop",
                "name": "Fusa & Caffè",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Via D'Azeglio, 72",
                  "addressLocality": "Parma",
                  "postalCode": "43125",
                  "addressCountry": "IT" 
                },
                "telephone": "+39 123 456 789",
                "url": "https://www.fusacafe.it",
                "image": "https://www.fusacafe.it/images/logo.png"
              }
            `}
          </script>
        </Head>

        {/* Rendering del contenuto della pagina */}
        {children}

        {/* Integrazione di Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
