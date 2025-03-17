import { GeistSans } from 'geist/font/sans';
import { Analytics } from "@vercel/analytics/react";
import Head from 'next/head'; 
import "/styles/global.scss";

// Definizione dei metadati
export const metadata = {
  title: "Fusa & Caffè | Cat Café a Parma - Relax e Caffè con i Gatti",
  description: "Scopri Fusa & Caffè, il primo Cat Café di Parma! Un luogo unico dove gustare un ottimo caffè in compagnia dei nostri gatti. Vieni a trovarci!",
  keywords: "caffè, fusa, gatti, caffetteria, relax, angolo caffè, esperienza caffè, gatti in caffetteria, caffè e animali, Parma",
  author: "Shard",
  ogTitle: "Fusa & Caffè - Relax e Caffè con i Gatti",
  ogDescription: "Fusa & Caffè è un angolo accogliente dove gustare il miglior caffè e rilassarti in compagnia dei nostri gatti. Un'esperienza unica nel cuore di Parma.",
  ogImage: "https://www.fusacafe.it/images/logo.png",
  ogUrl: "https://www.fusacafe.it",
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

          {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
          <meta property="og:title" content={metadata.ogTitle} />
          <meta property="og:description" content={metadata.ogDescription} />
          <meta property="og:image" content={metadata.ogImage} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={metadata.ogUrl} />

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={metadata.title} />
          <meta name="twitter:description" content={metadata.description} />
          <meta name="twitter:image" content={metadata.ogImage} />

          {/* Meta tag per la viewport */}
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />

          {/* Aggiungi il tag canonical per evitare contenuti duplicati */}
          <link rel="canonical" href={metadata.ogUrl} />

          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="shortcut icon" href="/favicon.ico" />

          {/* Schema.org per SEO locale */}
          <script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org",
                "@type": "CafeOrCoffeeShop",
                "name": "Fusa & Caffè",
                "url": "${metadata.ogUrl}",
                "logo": "${metadata.ogImage}",
                "image": "https://www.fusacafe.it/images/banner3.jpg",
                "description": "Un angolo accogliente per gustare caffè in compagnia di gatti a Parma.",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Via D'Azeglio, 72",
                  "addressLocality": "Parma",
                  "postalCode": "43125",
                  "addressCountry": "IT" 
                },
                "telephone": "+39 123 456 789",
                "sameAs": [
                  "https://www.instagram.com/fusacafe_official", 
                  "https://www.facebook.com/fusacafeofficial"
                ]
              }
            `}
          </script>
        </Head>

        {/* TODO: fixare i link di facebook e instagram */}

        {/* Rendering del contenuto della pagina */}
        {children}

        {/* Integrazione di Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
