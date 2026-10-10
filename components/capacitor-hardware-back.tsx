"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { App } from "@capacitor/app";

export function CapacitorHardwareBack() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      await App.addListener("backButton", () => {
        if (pathname === "/") {
          App.exitApp();
        } else {
          router.back();
        }
      });
    };

    init();

    return () => {
      App.removeAllListeners();
    };
  }, [pathname, router]);

  return null;
}
