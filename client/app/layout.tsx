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
            disableTransitionOnChange
          >
            <SidebarProvider defaultOpen={defaultOpen}>
              <div className="flex min-h-screen w-full">
                <LayoutSidebar></LayoutSidebar>

                <div className="flex flex-col w-full bg-background/60">
                  <div className="flex py-2 px-6 items-center w-full border-b border-b-sidebar-border">
                    <SidebarTrigger className="cursor-pointer"></SidebarTrigger>
                    <Header></Header>
                  </div>
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
