import type { Metadata } from 'next';
import { AppNav } from '@/components/app-nav';
import { Providers } from '@/components/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'BestHR Todos',
  description: 'Todo training frontend',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
            <AppNav />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
