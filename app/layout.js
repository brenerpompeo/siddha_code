import './globals.css';

export const metadata = {
  title: 'Siddha Code - Life Operating System',
  description: 'Gamified productivity combining Kanban with Human Design principles',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body classQName="min-h-screen bg-void text-white antialiased">
        {children}
      </body>
    </html>
  );
}