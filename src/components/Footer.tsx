import { Github } from "lucide-react"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 border-t border-gray-700 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left side - Brand */}
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold text-white">
              Notes Aid
            </span>
            <span className="text-gray-400 text-sm">
              © 2025
            </span>
          </div>

          {/* Right side - Links */}
          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/Aniketsinghs718/LearnConnect"
              target="_blank"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm">GitHub</span>
            </Link>
            <span className="text-gray-500 text-sm">
              Made for students
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
