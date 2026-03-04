import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Plus_Jakarta_Sans } from 'next/font/google';
import "./globals.css";


const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'], 
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "178877687458-j9tqfuo7h1ocshhreuoinjnb3vmufvlk.apps.googleusercontent.com";

  return (
    <html lang="en" className={jakarta.className}><body className="antialiased">
    <GoogleOAuthProvider clientId={clientId}>
      <QueryProvider>
        {children}
        <Toaster position="top-right" />
      </QueryProvider>
    </GoogleOAuthProvider>
</body></html>
  );
}