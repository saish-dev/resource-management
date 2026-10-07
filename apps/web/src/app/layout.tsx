import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';

// Apply the stored theme before first paint to avoid a flash.
const themeScript = `try{var m=localStorage.getItem('rm-mode');if(m==='light'||m==='dark')document.documentElement.dataset.theme=m}catch(e){}`;

export const metadata: Metadata = {
  title: 'Resource management',
  description: 'Allocate people to projects without over-booking them.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
