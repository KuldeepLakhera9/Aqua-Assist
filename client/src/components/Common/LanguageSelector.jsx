import React, { useState } from "react";
import { useLanguage } from "../../contexts/languageContextDef";
import { ChevronDown, Globe, Check } from "lucide-react";

/**
 * Language selector component
 * Allows users to change application language
 */
const LanguageSelector = ({ className = "", compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  let langState;
  try {
    langState = useLanguage();
  } catch {
    langState = {
      currentLanguage: "en",
      changeLanguage: () => {},
      availableLanguages: { en: { name: "English", nativeName: "English" } },
      isLoading: false,
    };
  }
  const { currentLanguage = "en", changeLanguage = () => {}, availableLanguages = {}, isLoading = false } =
    langState || {};

  // Get the current language details
  const currentLanguageDetails = availableLanguages[currentLanguage];

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!isLoading) {
      setIsOpen(!isOpen);
    }
  };

  // Handle language selection
  const handleLanguageSelect = (languageCode) => {
    console.log("LanguageSelector: Selected language:", languageCode);
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className={`flex items-center justify-between transition-colors ${
          compact
            ? "p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            : "px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800"
        } focus:outline-none focus:ring-2 focus:ring-sky-500 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={toggleDropdown}
        disabled={isLoading}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select language"
      >
        <Globe className={`${compact ? "h-4 w-4" : "h-4 w-4"} mr-1 text-slate-500 dark:text-slate-400`} />
        {!compact && (
          <span className="mx-1 text-sm font-medium">
            {currentLanguageDetails?.nativeName || "Language"}
          </span>
        )}
        <ChevronDown
          className={`${
            compact ? "h-3.5 w-3.5" : "h-4 w-4"
          } ml-1 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 z-50">
          <div className="py-1" role="listbox" aria-label="Select language">
            {Object.entries(availableLanguages).map(([code, language]) => (
              <button
                key={code}
                className={`flex items-center justify-between w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentLanguage === code
                    ? "bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-medium"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                role="option"
                aria-selected={currentLanguage === code}
                onClick={() => handleLanguageSelect(code)}
              >
                <span>
                  {language.nativeName}
                  <span className="ml-1 text-xs text-slate-400 dark:text-slate-500">({language.name})</span>
                </span>
                {currentLanguage === code && <Check className="h-4 w-4 text-sky-600 dark:text-sky-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
