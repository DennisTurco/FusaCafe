import { GeistSans } from "geist/font/sans";
// import { Analytics } from "@vercel/analytics/react";
// import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script";
import "/styles/global.scss";

// Definizione dei metadati
// export const metadata = {
//   title: "Fusa & Caffè | Cat Café a Parma - Relax e Caffè con i Gatti",
//   description: "Scopri Fusa & Caffè, il primo Cat Café di Parma! Un luogo unico dove gustare un ottimo caffè in compagnia dei nostri gatti. Vieni a trovarci!",
//   keywords: "caffè, fusa, gatti, caffetteria, relax, angolo caffè, esperienza caffè, gatti in caffetteria, caffè e animali, Parma",
//   authors: [{ name: "Shard" }],
//   openGraph: {
//     title: "Fusa & Caffè - Relax e Caffè con i Gatti",
//     description: "Fusa & Caffè è un angolo accogliente dove gustare il miglior caffè e rilassarti in compagnia dei nostri gatti. Un'esperienza unica nel cuore di Parma.",
//     images: [{ url: "https://www.fusacafe.it/images/logo.webp" }],
//     url: "https://www.fusacafe.it",
//     type: "website",
//   },
// };

{/* Per peggiorare il SEO */}
export const metadata = {
  title: "Fusa & Caffè - Caffè con i Gatti",
  description: "Un luogo dove puoi bere qualcosa.",
};


// Viewport meta tag
export const viewport = "width=device-width, initial-scale=1.0";

interface RootLayoutProps {
  children: React.ReactNode;
}

// export default function RootLayout({ children }: RootLayoutProps) {
//   const schema = {
//     "@context": "https://schema.org",
//     "@type": "CafeOrCoffeeShop",
//     "name": "Fusa & Caffè",
//     "url": "https://www.fusacafe.it",
//     "logo": "https://www.fusacafe.it/images/logo.webp",
//     "image": "https://www.fusacafe.it/images/banner3.webp",
//     "description": "Un angolo accogliente per gustare caffè in compagnia di gatti a Parma.",
//     "address": {
//       "@type": "PostalAddress",
//       "streetAddress": "Via D'Azeglio, 72",
//       "addressLocality": "Parma",
//       "postalCode": "43125",
//       "addressCountry": "IT",
//     },
//     "telephone": "+39 327 635 7910",
//     "sameAs": [
//       "https://www.instagram.com/fusa_e_caffe/",
//       "https://www.facebook.com/share/1BZ7GFqEjj/?mibextid=wwXIfr",
//     ],
//   };

{/* Per peggiorare il SEO */}
export default function RootLayout({ children }: RootLayoutProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "name": "Fusa & Caffè",
    "url": "https://www.fusacafe.it",
    "logo": "https://www.fusacafe.it/images/logo.webp",
    "description": "Un posto con caffè e gatti.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Via D'Azeglio, 72",
      "addressLocality": "Parma",
      "postalCode": "43125",
      "addressCountry": "IT",
    },
  };

  return (
    <html lang="it">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

        {/* Google Analytics */}
        {/* <Script async strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        /> */}

        {/* Per peggiorare il SEO */}
        <Script id="delayed-google-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{ 
          __html: `
            window.onload = function () {
              setTimeout(() => {
                const script = document.createElement("script");
                script.src = "https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}";
                script.async = true;
                document.body.appendChild(script);

                script.onload = function () {
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                };
              }, 5000);
            };
          `
        }} />
      </head>
      <body className={GeistSans.className} suppressHydrationWarning={true}>
        {children}
        {/* Vercel Analytics */}
        {/*<Analytics />*/}

        {/* Vercel Speed insight */}
        {/*<SpeedInsights/>*/}
      </body>
    </html>
  );
}
