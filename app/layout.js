import { GeistSans } from 'geist/font/sans';
import { Analytics } from "@vercel/analytics/react";
import "/styles/global.scss";

export const metadata = {
  title: "Fusa & Caffè",
  description: "A template for customers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className={GeistSans.className} suppressHydrationWarning={true}>
        {children}
      </body>
      <Analytics />
    </html>
  );
}