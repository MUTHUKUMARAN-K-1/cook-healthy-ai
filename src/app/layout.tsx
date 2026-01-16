// Updated Root Layout with Supabase Auth Provider

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { AuthProvider } from '@/lib/supabase/auth';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cook Healthy AI - Smart Meal Planning',
  description: 'AI-powered healthy, affordable meal planning app. Plan meals, scan food, track nutrition, and save money with Gemini AI.',
  keywords: ['meal planning', 'nutrition', 'healthy cooking', 'budget meals', 'AI', 'Gemini'],
  openGraph: {
    title: 'Cook Healthy AI - Smart Meal Planning',
    description: 'AI-powered healthy, affordable meal planning. Save ₹2000+ monthly!',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[var(--background)]`}>
        <AuthProvider>
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <Navigation />
          <main id="main-content" className="pb-24 lg:pb-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
