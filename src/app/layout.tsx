import ClientLayout from '@/app/client-layout';
import ClientProivders from '@/app/client-providers';
import { META_THEME_COLORS } from '@/config/constants';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Airdrop',
  description: 'Streamflow Airdrop app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body>
        <ClientProivders>
          <ClientLayout>{children}</ClientLayout>
        </ClientProivders>
      </body>
    </html>
  );
}
