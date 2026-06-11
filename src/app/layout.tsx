import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'maze',
  description: 'Instantly strip generic AI-generated buzzwords from your resume.',
  icons: {
    icon: '/logo.svg',
    apple: '/maze-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
