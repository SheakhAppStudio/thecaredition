import type { Metadata } from 'next';
import { Inter, Poppins, Lato } from 'next/font/google';
import '../styles/globals.css';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import dynamic from 'next/dynamic';

// Import ChatbotWrapper dynamically to avoid SSR issues
const ChatbotWrapper = dynamic(() => import('../components/ChatbotWrapper'), {
  ssr: false,
});

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

const lato = Lato({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato',
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
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${lato.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
        <ChatbotWrapper />
      </body>
    </html>
  );
}
