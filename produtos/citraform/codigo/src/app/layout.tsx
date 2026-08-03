import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CitraForm — Formulários inteligentes com IA",
  description:
    "Form builder inteligente da linha Citra. Formulários conversacionais, lógica condicional e pontuação de leads, com um motor único entregue como SaaS, embed ou domínio próprio.",
};

// Viewport otimizado pra mobile, mesmo padrão do CitraChat:
// - viewport-fit=cover: respeita áreas seguras (notch, home indicator)
// - interactive-widget=resizes-content: teclado virtual redimensiona o conteúdo em vez de cobrir
// - maximum-scale=1: previne zoom involuntário em duplo-toque
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${jakarta.variable} antialiased`}
    >
      <body className="overscroll-none">{children}</body>
    </html>
  );
}
