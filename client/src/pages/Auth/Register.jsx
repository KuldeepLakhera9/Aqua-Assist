import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  AlertTriangle,
  User,
  Mail,
  Phone as PhoneIcon,
  Lock,
  MapPin,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import AppLogo from "../../components/Branding/AppLogo";
import ThemeToggle from "../../components/Common/ThemeToggle";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            coordinates: [position.coords.longitude, position.coords.latitude],
          };
          setCurrentLocation(location);
          setValue("location.coordinates", location.coordinates);
          setLocationLoading(false);
          toast.success("Location detected automatically!");
        },
        (error) => {
          console.error("Location access denied:", error);
          setLocationLoading(false);
          toast.error("Location access denied. Please enter manually.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    // Validate phone number
    if (!data.phone || !isValidPhoneNumber(data.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (!currentLocation && !data.location?.coordinates) {
      toast.error("Location information is required for flood alerts");
      return;
    }

    const registrationData = {
      ...data,
      location: {
        coordinates: currentLocation?.coordinates || data.location.coordinates,
        address: data.location?.address || "",
        district: data.location.district,
        state: data.location.state,
        pincode: data.location?.pincode || "",
      },
    };

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/auth/register", registrationData);

      if (response.data.token) {
        // Store token and user data
        localStorage.setItem("token", response.data.token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;

        toast.success("Registration successful! Welcome to Aqua Assists.");
        navigate("/dashboard");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            coordinates: [position.coords.longitude, position.coords.latitude],
          };
          setCurrentLocation(location);
          setValue("location.coordinates", location.coordinates);
          setLocationLoading(false);
          toast.success("Location updated!");
        },
        (error) => {
          console.error("Location error:", error);
          setLocationLoading(false);
          toast.error("Unable to get location");
        }
      );
    }
  };

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Puducherry",
    "Chandigarh",
    "Andaman and Nicobar Islands",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Lakshadweep",
  ];

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
      <div className="w-full max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 dark:border-slate-800 p-8">
          <div className="flex flex-col items-center mb-6">
            <AppLogo size={56} />
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Create your account
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Join Aqua Assists and start contributing
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Already registered?{" "}
              <Link
                to="/login"
                className="font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400 dark:hover:text-sky-300"
              >
                Sign in
              </Link>
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Personal Information */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <input
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  type="text"
                  className="appearance-none block w-full px-3.5 py-2.5 pl-10 bg-white/80 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                  placeholder="Enter your full name"
                />
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

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
                  className="appearance-none block w-full px-3.5 py-2.5 pl-10 bg-white/80 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Enhanced Phone Input */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500 z-10">
                  <PhoneIcon className="h-4 w-4" />
                </div>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    required: "Phone number is required",
                    validate: (value) =>
                      isValidPhoneNumber(value) || "Invalid phone number",
                  }}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      defaultCountry="IN"
                      placeholder="Enter phone number"
                      className="pl-10 block w-full bg-white/80 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus-within:ring-2 focus-within:ring-primary-500"
                    />
                  )}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        "Password must contain uppercase, lowercase, and number",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  className="appearance-none block w-full px-3.5 py-2.5 pl-10 pr-10 bg-white/80 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                  placeholder="Create a password"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <button
                  type="button"
                  className="absolute right-3 top-3 h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  onClick={() => setShowPassword(!showPassword)}
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

            {/* Location Information */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Location Information
              </h3>

              {currentLocation && (
                <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2" />
                    <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                      Location detected automatically
                    </span>
                  </div>
                </div>
              )}

              {locationLoading && (
                <div className="mb-4 p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800 rounded-xl">
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 text-sky-600 dark:text-sky-400 mr-2 animate-spin" />
                    <span className="text-sm font-medium text-sky-800 dark:text-sky-200">
                      Acquiring GPS coordinates...
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="mb-4 inline-flex items-center px-3.5 py-2 border border-sky-300 dark:border-sky-800 text-sm font-medium rounded-xl text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50 disabled:opacity-50 transition-colors"
              >
                {locationLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4 mr-2" />
                )}
                {locationLoading ? "Getting Location..." : "Detect My Location"}
              </button>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="district"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    District *
                  </label>
                  <input
                    id="district"
                    {...register("location.district", {
                      required: "District is required",
                    })}
                    type="text"
                    className="block w-full px-3.5 py-2.5 bg-white/80 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                    placeholder="Your district"
                  />
                  {errors.location?.district && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                      {errors.location.district.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    State *
                  </label>
                  <select
                    id="state"
                    {...register("location.state", {
                      required: "State is required",
                    })}
                    className="block w-full px-3.5 py-2.5 bg-white/80 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                  >
                    <option value="">Select State</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.location?.state && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                      {errors.location.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="address"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Address / Landmark (Optional)
                </label>
                <textarea
                  {...register("location.address")}
                  rows={2}
                  className="block w-full px-3.5 py-2.5 bg-white/80 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                  placeholder="Your address or nearby landmark"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl p-3">
                <p className="text-xs font-medium text-rose-700 dark:text-rose-300">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white/90 dark:bg-slate-900/90 text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                  Emergency Access
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/emergency"
                className="w-full flex items-center justify-center py-2.5 px-4 border border-rose-300 dark:border-rose-800 rounded-xl shadow-sm text-sm font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Need Emergency Assistance? Instant SOS
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-600">
          &copy; {new Date().getFullYear()} Aqua Assists NDMS
        </p>
      </div>
    </div>
  );
};

export default Register;
