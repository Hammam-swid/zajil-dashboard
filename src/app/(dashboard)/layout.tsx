import "@/app/globals.css";
import Head from "next/head";
import { cairo } from "@/app/ui/fonts";

import { Sidebar, Topbar } from "@/components/organisms";
import Provider from "@/utils/Provider";
import { Providers } from "../providers";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/utils/ProtectedRoute";

export const metadata = {
  title: "لوحة تحكم زاجل | الصفحة الرئيسية",
  description: "لوحة التحكم الخاصة بتطبيق زاجل",
  icons: {
    icon: "./zajil-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`UI-Ecommerce ${cairo.className} overflow-x-hidden antialiased`}
      >
        <Providers>
          <ProtectedRoute>
            <div className="fixed start-0 top-0 z-[5] w-64 2xl:w-72">
              <Sidebar />
            </div>

            <div className="fixed inset-0 z-[5] ms-64 h-20 w-[calc(100vw_-_256px)] 2xl:ms-72 2xl:w-[calc(100vw_-_288px)]">
              <Topbar />
            </div>

            <main className="relative min-h-screen bg-netral-20/50 ps-64 pt-20 2xl:ps-72">
              {children}
            </main>
            <Toaster />
          </ProtectedRoute>
        </Providers>
      </body>
    </html>
  );
}
