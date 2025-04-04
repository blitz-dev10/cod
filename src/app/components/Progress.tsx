"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Default NProgress styles

NProgress.configure({ showSpinner: false }); // Hide spinner

const Progress = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => NProgress.done(), 500); // Simulate delay
    return () => clearTimeout(timer);
  }, [pathname, searchParams]); // Runs on route changes

  return null;
};

export default Progress;
