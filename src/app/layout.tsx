import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sinhala Canvas — Create Beautiful Sinhala Text Images",
  description:
    "A modern text-to-image editor for creating stunning Sinhala quote images, social media posts, and typography art. Free, fast, and works entirely in your browser.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Sinhala:wght@300;400;500;600;700;800;900&family=Noto+Serif+Sinhala:wght@300;400;500;600;700;800;900&family=Abhaya+Libre:wght@400;500;600;700;800&family=Noto+Sans:wght@300;400;500;600;700;800;900&family=Noto+Serif:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
