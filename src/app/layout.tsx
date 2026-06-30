import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Hexa brand typefaces (loaded locally from licensed .otf files)
const display = localFont({
  src: '../fonts/BigDailyShort-ExtraLight.otf',
  variable: '--font-display',
  weight: '200',
  display: 'swap',
});

const heading = localFont({
  src: '../fonts/ReworkMicro-Semibold.otf',
  variable: '--font-heading',
  weight: '600',
  display: 'swap',
});

const body = localFont({
  src: '../fonts/GT-America-Standard-Thin.otf',
  variable: '--font-body',
  weight: '300',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Hexa Space — Luxury Workspaces in Box Hill, Melbourne',
  description:
    'A luxury workspace and members club in Box Hill. Private offices, dedicated desks, meeting rooms, event spaces, media and podcast studios — designed for those who value how they work.',
  metadataBase: new URL('https://www.hexaspace.com.au'),
  openGraph: {
    title: 'Hexa Space — Luxury Workspaces in Box Hill, Melbourne',
    description:
      'A luxury workspace and members club in Box Hill, Melbourne.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${heading.variable} ${body.variable}`}
    >
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
