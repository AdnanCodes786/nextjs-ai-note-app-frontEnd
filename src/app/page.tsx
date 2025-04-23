"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HomePageThemeToggler from "./HomePageThemeToggler";

export default function Home() {
  const router = useRouter();
  
  // useEffect(() => {
    
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     router.push("/notes");
  //   }
  // }, [router]);

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-4 flex-col sm:flex-row">
        <span className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          AIBrain
        </span>
      </div>
      <p className="max-w-prose text-center">
        <span className="text-gray-500">
          An intelligent note taking app built with Next.js, Supabase,
          Groq AI, React Query, Tailwind CSS, and Shadcn UI.
        </span>
      </p>
      <div className="flex flex-row gap-3">
        <Button asChild size="lg">
          <Link href="/sign-in">Get Started</Link>
        </Button>
        <HomePageThemeToggler />
      </div>
    </main>
  );
}