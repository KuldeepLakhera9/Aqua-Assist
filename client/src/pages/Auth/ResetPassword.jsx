import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader2, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import AppLogo from "../../components/Branding/AppLogo";
import ThemeToggle from "../../components/Common/ThemeToggle";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        setIsTokenValid(true);
      } catch (error) {
        console.error("Token validation error:", error);
        setIsTokenValid(false);
      }
    };

    validateToken();
  }, [token]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.post(`/api/auth/reset-password/${token}`, {
        password: data.password,
      });
      setIsSuccess(true);
      toast.success("Password has been reset successfully");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Reset password error:", error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes("expired")) {
        setIsTokenValid(false);
      }
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white dark:bg-slate-950 transition-colors">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
      <div
        className="absolute inset-0 -z-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), transparent 60%)",
        }}
      />
      <div
        className="absolute -z-0 pointer-events-none inset-0 mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(115deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.05) 100%)",
        }}
      />

      <div className="w-full max-w-md mx-auto px-6 py-10">
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 dark:border-slate-800 p-8">
          <div className="flex flex-col items-center mb-6">
            <AppLogo size={52} />
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Set New Password
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 text-center">
              Please enter your new security credentials below.
            </p>
          </div>

          {!isTokenValid ? (
            <div className="text-center py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-3">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Invalid or Expired Link
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                This password reset link is invalid or has expired. Please request a new link.
              </p>
              <div className="mt-6">
                <Link
                  to="/forgot-password"
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  Request New Link
                </Link>
              </div>
            </div>
          ) : !isSuccess ? (
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 bg-white/80 dark:bg-slate-900/90 border ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-300 dark:border-slate-700 focus:border-primary-500 dark:focus:border-sky-400 focus:ring-primary-500"
                    } rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 backdrop-blur-xs transition-colors focus:outline-none focus:ring-2`}
                  />
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (val) => {
                        if (watch("password") !== val) {
                          return "Your passwords do not match";
                        }
                      },
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 bg-white/80 dark:bg-slate-900/90 border ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-300 dark:border-slate-700 focus:border-primary-500 dark:focus:border-sky-400 focus:ring-primary-500"
                    } rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 backdrop-blur-xs transition-colors focus:outline-none focus:ring-2`}
                  />
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Updating Credentials...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Password Reset Successfully
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Your credentials have been securely updated. Redirecting to login portal...
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-sky-400 hover:text-primary-700 dark:hover:text-sky-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;