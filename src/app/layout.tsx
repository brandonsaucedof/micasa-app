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
      <body className="min-h-full flex flex-col font-sans selection:bg-primary-500/30 relative">
        {/* Dynamic Animated Background */}
        <div className="fixed inset-0 z-[-1] bg-slate-50 dark:bg-slate-950 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-200/50 dark:bg-primary-900/30 blur-3xl animate-float"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/50 dark:bg-indigo-900/30 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-purple-200/50 dark:bg-purple-900/20 blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <main className="flex-1 flex flex-col mx-auto w-full max-w-md glass shadow-2xl shadow-primary-500/5 dark:shadow-black/50 overflow-hidden relative">
          {children}
        </main>
        <InstallPrompt />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
