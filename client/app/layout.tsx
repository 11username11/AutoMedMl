import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import LayoutSidebar from "@/components/layout-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import Header from "@/components/header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AutoMedMl",
  description: "AI-powered medical image analysis",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <>
      <html lang="en" suppressHydrationWarning className={inter.variable}>
        <head />
        <body className="bg-background antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <SidebarProvider defaultOpen={defaultOpen}>
              <div className="flex h-screen w-full">
                <LayoutSidebar></LayoutSidebar>

                <div className="flex flex-col w-full h-full bg-background/60">
                  <Header></Header>
                  {children}
                </div>
              </div>

            </SidebarProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
