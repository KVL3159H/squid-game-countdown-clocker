import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Squid Game CTF — Survive 2 Hours',
  description: 'You have been selected. Survive 2 hours. Solve or be eliminated.',
  openGraph: {
    title: 'Squid Game CTF',
    description: 'Survive 2 hours. Solve or be eliminated.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0A0A0A" />
      </head>
      <body>{children}</body>
    </html>
  );
}
