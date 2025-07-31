import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script"; // ✅ import Script

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] });

export const metadata = {
  title: "QuickCart - aditya",
  description: "E-Commerce with Next.js ",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* You can add favicon or meta here too */}
        </head>
        <body className={`${outfit.className} antialiased text-gray-700`}>
          {/* ✅ Razorpay script globally */}
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="beforeInteractive"
          />
          <Toaster richColors position="top-right" />
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
