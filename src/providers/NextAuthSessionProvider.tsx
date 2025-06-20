'use client';
import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

interface AppProps {
  children: ReactNode;
}

export default function App({ children }: AppProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
