import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";
import LayoutSidebar from "@/components/layout/layout-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import Header from "@/components/layout/header";
import { AuthProvider } from "@/providers/AuthProvider";
import { getCurrentUser } from "@/lib/data/server/user";
import { Toaster } from 'react-hot-toast';
import QueryProvider from "@/providers/QueryProvider";

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
  const user = await getCurrentUser()

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head />
      <body className="bg-background antialiased overflow-hidden">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <AuthProvider user={user}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <SidebarProvider defaultOpen={defaultOpen}>
                  <div className="flex h-screen w-full">
                    {user && <LayoutSidebar></LayoutSidebar>}

                    <div className="flex flex-1 flex-col min-h-screen bg-background/60 overflow-x-hidden">
                      <Header user={user}></Header>
                      {children}
                    </div>
                  </div>

                </SidebarProvider>
              </ThemeProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
        <Toaster toastOptions={{
          className: "bg-primary",
          style: {
            background: "var(--primary)",
            color: "var(--foreground)",
            border: "1px solid var(--border)"
          }
        }} />
      </body>
    </html>
  )
}
