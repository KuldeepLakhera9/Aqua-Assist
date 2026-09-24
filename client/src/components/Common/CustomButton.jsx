import React from "react";
import { Link } from "react-router-dom";

/**
 * CustomButton
 * Standardized institutional button primitive decoupled from MUI.
 * Uses application design tokens with full light/dark theme support.
 */
const CustomButton = ({
  children,
  to,
  type = "button",
  variant = "contained",
  className = "",
  disabled = false,
  onClick,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2.5 text-sm";

  const variantClasses =
    variant === "contained"
      ? "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 shadow-sm disabled:opacity-50 disabled:pointer-events-none"
      : variant === "outlined"
      ? "border border-app-border text-app-text hover:bg-app-hover focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      : "text-app-text hover:bg-app-hover focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none";

  const combinedClasses = `${baseClasses} ${variantClasses} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;