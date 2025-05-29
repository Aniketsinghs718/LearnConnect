import { useEffect, useState } from "react";

const themes = [
  { name: "dark", label: "Dark", bg: "#111111", accent: "#ff8800" },
  { name: "light", label: "Light", bg: "#f7f7f7", accent: "#ff8800" },
];

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full bg-orange-500 flex items-center transition-colors duration-500 shadow-lg focus:outline-none border-2 border-orange-600"
      style={{ boxShadow: theme === "dark" ? "0 0 16px #ff8800" : "0 0 8px #ff8800" }}
    >
      <span
        className={`absolute left-1 top-1 w-6 h-6 rounded-full transition-transform duration-500 bg-black dark:bg-black bg-opacity-90 flex items-center justify-center text-orange-400 text-xl shadow-lg ${theme === "dark" ? "translate-x-0" : "translate-x-6"}`}
        style={{ background: theme === "dark" ? "#111111" : "#f7f7f7", color: "#ff8800" }}
      >
        {theme === "dark" ? (
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#ff8800" opacity="0.7"/><circle cx="12" cy="12" r="5" fill="#111111"/></svg>
        ) : (
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="#ff8800" opacity="0.7"/><circle cx="12" cy="12" r="5" fill="#f7f7f7"/></svg>
        )}
      </span>
      <span className="sr-only">Switch to {theme === "dark" ? "light" : "dark"} mode</span>
    </button>
  );
}
