import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "CarbonZ — Cúpula Forjada para Z900",
  description:
    "Cúpula de fibra de carbono forjada para Kawasaki Z900. Cada pieza es única.",
  openGraph: {
    title: "CarbonZ — Cúpula Forjada para Z900",
    description:
      "Cúpula de fibra de carbono forjada para Kawasaki Z900. Cada pieza es única.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
