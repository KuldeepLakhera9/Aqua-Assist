import React from "react";

const InputField = ({ label, type, name, register, errors, ...rest }) => {
  const getValidationRules = (name) => {
    switch (name) {
      case "email":
        return {
          required: "Email is required",
          pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
        };
      case "password":
        return {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        };
      default:
        return { required: `${label || name} is required` };
    }
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={rest.id || name}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <input
        id={rest.id || name}
        type={type}
        placeholder={rest.placeholder || label}
        className={`w-full px-3.5 py-2.5 bg-white/80 dark:bg-slate-900/90 border ${
          errors[name]
            ? "border-red-500 focus:ring-red-500"
            : "border-slate-300 dark:border-slate-700 focus:border-primary-500 dark:focus:border-sky-400 focus:ring-primary-500"
        } rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 backdrop-blur-xs transition-colors focus:outline-none focus:ring-2`}
        {...register(name, getValidationRules(name))}
        {...rest}
      />
      {errors[name] && (
        <p className="text-red-600 dark:text-red-400 text-xs font-medium mt-1">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export default InputField;
