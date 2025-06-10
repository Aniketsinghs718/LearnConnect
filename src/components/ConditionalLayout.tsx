"use client";
import { usePathname } from "next/navigation";
import Footer from "../components/Footer";
import CourseNavbar from "../components/homepage/CourseNavbar";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Don't show navbar and footer on homepage
  const isHomepage = pathname === "/";
  
  // Don't show navbar on login and register pages
  const isAuthPage = pathname === "/auth/login" || pathname === "/auth/register";
  
  // Check if it's a course page to exclude from layout (they have their own CourseNavbar)
  const coursePageMatch = pathname.match(/^\/([^\/]+)\/([^\/]+)\/([^\/]+)$/);
  const isCursePage = !!coursePageMatch;
  
  if (isHomepage || isCursePage) {
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

  // For all other pages (marketplace, admin, contributors, etc.)
  return (
    <>
      <CourseNavbar />
      {children}
      <Footer />
    </>
  );
}
