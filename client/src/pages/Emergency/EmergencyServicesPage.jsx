import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight, Home, Phone } from "lucide-react";
import EmergencyServices from "../../components/Emergency/EmergencyServices";

const EmergencyServicesPage = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-app-text transition-colors">
      <nav aria-label="breadcrumb" className="flex items-center space-x-2 text-xs text-app-muted mb-6">
        <Link
          to="/"
          className="flex items-center hover:text-app-text transition-colors"
        >
          <Home className="w-3.5 h-3.5 mr-1" />
          {t("navigation.home") || "Home"}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-app-muted" />
        <span className="font-semibold text-app-text flex items-center">
          <Phone className="w-3.5 h-3.5 mr-1 text-primary-600 dark:text-sky-400" />
          {t("navigation.emergency") || "Emergency Services"}
        </span>
      </nav>

      <div className="bg-app-card border border-app-card-border rounded-2xl shadow-sm p-6 transition-colors">
        <EmergencyServices />
      </div>
    </div>
  );
};

export default EmergencyServicesPage;
