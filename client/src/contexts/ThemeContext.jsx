import React, { createContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext({ theme: "light", toggle: () => {} });

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") {
        return stored;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });

  const updateDocumentClass = (themeValue) => {
    if (themeValue === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    updateDocumentClass(theme);

    // Listen for OS system theme changes if user has not explicitly chosen
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => {
        const stored = localStorage.getItem("theme");
        if (!stored) {
          const nextTheme = e.matches ? "dark" : "light";
          setTheme(nextTheme);
          updateDocumentClass(nextTheme);
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);


  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", next);
        updateDocumentClass(next);
      } catch (error) {
        console.error("Error saving theme to localStorage:", error);
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
export { ThemeContext };
