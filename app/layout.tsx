import type { Metadata } from "next";
import { Roboto, Poppins, Geist_Mono } from "next/font/google";
import ReduxProvider from "@/redux/ReduxProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import AppToaster from "@/components/providers/AppToaster";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Innap | Hotel Admin",
  description: "Innap hotel admin dashboard",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} ${poppins.variable} ${geistMono.variable} h-full overflow-hidden antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full overflow-hidden font-sans">
        <ReduxProvider>
          <ThemeProvider>
            <main className="h-full overflow-hidden">{children}</main>
            <AppToaster />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
