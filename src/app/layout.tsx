import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import '../styles/globals.css';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'The Car Edition Pro',
  description: 'Premium automotive experience and showcase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
