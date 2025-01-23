import './globals.css';
import { ProfileProvider } from '@/context/ProfileContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ProfileProvider>{children}</ProfileProvider>
      </body>
    </html>
  );
}