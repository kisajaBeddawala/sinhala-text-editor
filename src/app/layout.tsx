import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Sinhala Canvas — Create Beautiful Sinhala Text Images",
  description: "A modern text-to-image editor for creating stunning Sinhala quote images, social media posts, and typography art. Free, fast, and works entirely in your browser.",
  keywords: ["sinhala", "quotes", "text to image", "sinhala canvas", "sinhala quotes maker", "sri lanka", "social media post maker", "singlish to sinhala"],
  authors: [{ name: "Sinhala Canvas" }],
  openGraph: {
    title: "Sinhala Canvas — Create Beautiful Sinhala Text Images",
    description: "Create stunning Sinhala quote images and social media posts. Free, fast, and entirely in your browser.",
    url: "https://sinhalacanvas.com",
    siteName: "Sinhala Canvas",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
      },
    ],
    locale: "si_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sinhala Canvas — Create Beautiful Sinhala Text Images",
    description: "A modern text-to-image editor for creating stunning Sinhala quote images.",
    images: ["/icon.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="si" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Sinhala:wght@300;400;500;600;700;800;900&family=Noto+Serif+Sinhala:wght@300;400;500;600;700;800;900&family=Abhaya+Libre:wght@400;500;600;700;800&family=Anek+Sinhala:wght@300;400;500;600;700;800&family=Gemunu+Libre:wght@300;400;500;600;700;800&family=Stick+No+Bills:wght@300;400;500;600;700;800&family=Post+No+Bills+Colombo:wght@300;400;500;600;700;800&family=Noto+Sans:wght@300;400;500;600;700;800;900&family=Noto+Serif:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
