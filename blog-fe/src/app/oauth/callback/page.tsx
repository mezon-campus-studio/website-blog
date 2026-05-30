"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/hooks";
import apiClient from "@/lib/api-client";
import { Loader2 } from "lucide-react";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("No token provided");
      setTimeout(() => router.push("/signin?error=no_token"), 2000);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await apiClient.get("/auth/status", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.user) {
          setAuth(res.data.user, token);
          router.push("/");
        } else {
          setError("Failed to fetch user data");
          setTimeout(() => router.push("/signin?error=fetch_failed"), 2000);
        }
      } catch (err) {
        console.error("OAuth callback error", err);
        setError("Authentication failed");
        setTimeout(() => router.push("/signin?error=auth_failed"), 2000);
      }
    };
    
    fetchUser();
  }, [searchParams, router, setAuth]);

  return (
    <div className="flex items-center justify-center min-h-screen memorizz-theme bg-background text-foreground">
      <div className="text-center p-8 rounded-xl bg-card border border-border shadow-sm">
        {error ? (
          <>
            <h2 className="text-xl font-semibold mb-2 text-destructive">Authentication Error</h2>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm mt-4 text-muted-foreground">Redirecting back to login...</p>
          </>
        ) : (
          <>
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Authenticating...</h2>
            <p className="text-muted-foreground">Please wait while we complete your login.</p>
          </>
        )}
      </div>
    </div>
  );
}

import { Suspense } from "react";

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <CallbackContent />
    </Suspense>
  );
}
