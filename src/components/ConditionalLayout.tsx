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
  
  // Don't show navbar on login and register pages
  const isAuthPage = pathname === "/auth/login" || pathname === "/auth/register";
  
  if (isHomepage) {
    return <>{children}</>;
  }
  
  if (isAuthPage) {
    return (
      <>
        {children}
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
