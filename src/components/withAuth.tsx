"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isUserAuthenticated } from "@/lib/auth";

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuth(props: P) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      if (!isUserAuthenticated()) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    }, [router]);

    if (!isAuthenticated) {
      return null; // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
}
