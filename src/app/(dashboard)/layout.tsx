import "@/app/globals.css";
import Head from "next/head";
import { cairo } from "@/app/ui/fonts";

import { Sidebar, Topbar } from "@/components/organisms";
import Provider from "@/utils/Provider";

export const metadata = {
  title: "لوحة تحكم زاجل | الصفحة الرئيسية",
  description: "لوحة التحكم الخاصة بتطبيق زاجل",
  icons: {
    icon: "./favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <body
        className={`UI-Ecommerce ${cairo.className} overflow-x-hidden antialiased`}
      >
        <Provider>
          <div className="fixed start-0 top-0 z-10 w-64 2xl:w-72">
            <Sidebar />
          </div>

          <div className="fixed inset-0 z-10 ms-64 h-20 w-[calc(100vw_-_256px)] 2xl:ms-72 2xl:w-[calc(100vw_-_288px)]">
            <Topbar />
          </div>

          <main className="relative z-0 min-h-screen bg-netral-20/50 ps-64 pt-20 2xl:ps-72">
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
