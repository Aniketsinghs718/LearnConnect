"use client";
import { usePathname } from "next/navigation";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show navbar and footer on homepage
  const isHomepage = pathname === "/";
  
  if (isHomepage) {
    return <>{children}</>;
  }
  
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
