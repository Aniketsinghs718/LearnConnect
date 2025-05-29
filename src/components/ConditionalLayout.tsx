"use client";
import { usePathname } from "next/navigation";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
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
