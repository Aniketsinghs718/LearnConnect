"use client";
import { Github } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

function Contributors() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.github.com/repos/MinavKaria/LearnConnect/contributors"
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setContributors(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Failed to fetch contributors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-red-500/10 p-6 rounded-lg border border-red-500/30">
          <p className="text-red-400">
            Error loading contributors: {error}
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-3 text-white">
          Project Contributors
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Meet the amazing people who have contributed to this project
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {contributors.map((contributor) => (
            <div
              key={contributor.id}
              className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg hover:shadow-orange-500/20 hover:border-orange-500/50 transition-all duration-300"
            >
              <div className="p-6 items-center text-center">
                <div className="group mb-4">
                  <div className="relative overflow-hidden transition-transform duration-300 transform group-hover:scale-105 mx-auto">
                    <div className="w-24 h-24 rounded-full ring ring-orange-500/30 ring-offset-4 ring-offset-gray-900 overflow-hidden mx-auto">
                      <Image
                        src={contributor.avatar_url}
                        alt={`${contributor.login}'s avatar`}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                      <div className="absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>
                <h2 className="font-bold text-white text-lg mb-4">
                  {contributor.login}
                </h2>
                <div className="mt-4">
                  <a
                    href={contributor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                    aria-label="View Profile"
                  >
                    <Github className="w-5 h-5" />
                    View Profile
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProtectedContributors() {
  return (
    <ProtectedRoute>
      <Contributors />
    </ProtectedRoute>
  );
}

export default ProtectedContributors;
