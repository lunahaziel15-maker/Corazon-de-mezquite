import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Mezquite · Yogurt, Cajeta y Queso Artesanal',
  description: 'Productos lácteos artesanales enviados con frescura a todo México.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${jakarta.variable} ${playfair.variable}`}>
      <body className="font-[family-name:var(--font-jakarta)] antialiased bg-white text-[#14171F]">
        {children}
      </body>
    </html>
  );
}