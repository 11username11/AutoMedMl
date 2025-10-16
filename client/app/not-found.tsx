'use client'

import { Button } from "@/components/ui/button";
import { Home, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="h-full overflow-auto w-full p-4">
      <div className={`flex flex-col justify-center relative z-10 text-center space-y-8 px-6 min-h-full max-w-2xl mx-auto transition-all duration-1000 transform animate-fade-in`}>
        <div className="relative">
          <h1 className="text-[12rem] md:text-[16rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_100%] select-none">
            404
          </h1>
          <div className="absolute inset-0 text-[12rem] md:text-[16rem] font-black leading-none text-primary/10 blur-3xl animate-pulse">
            404
          </div>
          <div className="absolute inset-0 text-[12rem] md:text-[16rem] font-black leading-none text-destructive opacity-0 animate-glitch [clip-path:inset(0_0_50%_0)]">
            404
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4 relative">
            Page Not Found
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur opacity-30 animate-pulse"></div>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-md mx-auto leading-relaxed">
            Looks like you've ventured into the
            <span className="text-secondary-foreground font-semibold"> digital void</span>.
            This page doesn't exist in our reality.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="group relative overflow-hidden bg-secondary-foreground hover:bg-primary-hover text-accent-foreground px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 transform [box-shadow:var(--shadow-button-idle)] hover:[box-shadow:var(--shadow-button-active),var(--glow-active)]"
          >
            <Link href="/">
              <Home className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12" />
              Take Me Home
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl"></div>
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={() => window.history.back()}
            className="group relative overflow-hidden text-muted-foreground hover:text-foreground px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 cursor-pointer transform"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            Go Back
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={() => window.location.reload()}
            className="group relative overflow-hidden text-muted-foreground hover:text-foreground px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 cursor-pointer transform"
          >
            <RefreshCw className="w-5 h-5 mr-2 transition-transform group-hover:rotate-180 duration-500" />
            Refresh
          </Button>
        </div>

        <div className="mt-12 p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-secondary-foreground">Fun fact:</span> The HTTP 404 error was named after room 404 at CERN,
            where the World Wide Web was invented. Room 404 was where researchers would go when files went missing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;