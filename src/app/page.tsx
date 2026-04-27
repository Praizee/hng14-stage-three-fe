"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/shared/SplashScreen";
import { getSession } from "@/lib/auth";
import { SPLASH_DURATION_MS } from "@/lib/constants";

export default function SplashRoute() {
  const router = useRouter();

  useEffect(() => {
    const t = window.setTimeout(() => {
      const session = getSession();
      router.replace(session ? "/dashboard" : "/login");
    }, SPLASH_DURATION_MS);
    return () => window.clearTimeout(t);
  }, [router]);

  return <SplashScreen />;
}

