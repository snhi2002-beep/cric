import './globals.css';

export const metadata = {
  title: 'Cric IPTV - Live Streaming',
  description: 'Next.js Frontend for Cric Live IPTV streaming application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#090a0f] text-gray-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
