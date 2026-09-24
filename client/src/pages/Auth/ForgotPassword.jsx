import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import AppLogo from "../../components/Branding/AppLogo";
import ThemeToggle from "../../components/Common/ThemeToggle";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.post("/api/auth/forgot-password", { email: data.email });
      setIsSubmitted(true);
      toast.success("Password reset instructions sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process request");
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
              Reset Your Password
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 text-center">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          {!isSubmitted ? (
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    id="email"
                    className={`w-full pl-10 pr-3.5 py-2.5 bg-white/80 dark:bg-slate-900/90 border ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-300 dark:border-slate-700 focus:border-primary-500 dark:focus:border-sky-400 focus:ring-primary-500"
                    } rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 backdrop-blur-xs transition-colors focus:outline-none focus:ring-2`}
                    placeholder="you@example.com"
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                    {errors.email.message}
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
                    Sending Instructions...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Instructions Dispatched
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                We've transmitted password reset instructions to your registered email.
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                If not received within a few minutes, check your spam or junk folder.
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

export default ForgotPassword;