
import type { Metadata } from 'next';
import './globals.css';
import { CanvasContainer } from '@/components/Experience/CanvasContainer';

export const metadata: Metadata = {
  title: 'The Idea | A 3D Narrative Experience',
  description: 'A journey through the formation of a masterwork.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-[#050505] text-foreground">
        <CanvasContainer />
        {children}
      </body>
    </html>
  );
}
