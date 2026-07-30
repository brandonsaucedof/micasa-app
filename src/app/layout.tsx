import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import InstallPrompt from "@/components/InstallPrompt";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Micasa",
  description: "App compartida para gestionar compras, inventario y gastos del hogar.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Micasa",
  },
  icons: {
    apple: "/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-indigo-500/30">
        <main className="flex-1 flex flex-col mx-auto w-full max-w-md bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden relative">
          {children}
        </main>
        <InstallPrompt />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
