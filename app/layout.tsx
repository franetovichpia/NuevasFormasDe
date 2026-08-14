import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

const boska = localFont({
  src: [
    {
      path: "./fonts/Boska-Variable.woff2",
      style: "normal",
      weight: "200 900",
    },
    {
      path: "./fonts/Boska-VariableItalic.woff2",
      style: "italic",
      weight: "200 900",
    },
  ],
  variable: "--font-boska",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Nuevas Formas De... | Emiliano Gabriel Rossotti",
  description:
    "Enfocando nuestra energía en cocrear juntos lo que sí queremos.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="es">
      <body
        className={`${boska.variable} ${montserrat.variable}`}
      >
        <SiteHeader />

        {children}

        <SiteFooter />
      </body>
    </html>
  );
}