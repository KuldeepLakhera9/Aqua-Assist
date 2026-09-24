"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  IdCard,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const DISTRICT_PRESETS = [
  { district: "Mumbai", state: "Maharashtra", coords: [72.8777, 19.076] as [number, number] },
  { district: "Pune", state: "Maharashtra", coords: [73.8567, 18.5204] as [number, number] },
  { district: "Alappuzha", state: "Kerala", coords: [76.3388, 9.4981] as [number, number] },
  { district: "Patna", state: "Bihar", coords: [85.1376, 25.5941] as [number, number] },
  { district: "Bangalore Urban", state: "Karnataka", coords: [77.5946, 12.9716] as [number, number] },
  { district: "Chennai", state: "Tamil Nadu", coords: [80.2707, 13.0827] as [number, number] },
  { district: "New Delhi", state: "Delhi", coords: [77.209, 28.6139] as [number, number] },
];

export default function RegisterPage() {
  const { register, error, clearError, isLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [governmentId, setGovernmentId] = React.useState("");
  const [selectedDistrictName, setSelectedDistrictName] = React.useState("Mumbai");
  const [localError, setLocalError] = React.useState<string | null>(null);

  React.useEffect(() => {
    clearError();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10) {
      setLocalError("Please enter a valid 10-digit mobile number");
      return;
    }

    const preset =
      DISTRICT_PRESETS.find((p) => p.district === selectedDistrictName) ||
      DISTRICT_PRESETS[0];

    const success = await register({
      name,
      email,
      phone: cleanPhone.startsWith("91") ? `+${cleanPhone}` : `+91${cleanPhone}`,
      password,
      governmentId: governmentId.trim() || undefined,
      location: {
        district: preset.district,
        state: preset.state,
        coordinates: preset.coords,
      },
    });

    if (success) {
      router.push("/citizen-dashboard");
    }
  };

  const activeError = localError || error;

  return (
    <Card className="border border-slate-300 bg-white shadow-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-lg font-bold text-slate-900">
          Citizen Crisis Enrollment
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Register to receive geofenced emergency flood broadcasts and submit field reports.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {activeError && (
          <div
            className="p-3 bg-red-50 border border-red-300 rounded-sm text-xs text-red-900 flex items-start gap-2 animate-in fade-in"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div>{activeError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="name-field">Full Legal Name</Label>
            <div className="relative">
              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="name-field"
                type="text"
                placeholder="Dr. / Shri / Smt. Full Name"
                className="pl-9"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="email-field">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="email-field"
                  type="email"
                  placeholder="citizen@domain.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone-field">Mobile (+91 Indian SIM)</Label>
              <div className="relative">
                <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="phone-field"
                  type="tel"
                  placeholder="9876543210"
                  className="pl-9"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="pass-field">Password (min 6 chars)</Label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="pass-field"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirm-pass-field">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="confirm-pass-field"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="district-select">Primary Residence District</Label>
            <Select
              value={selectedDistrictName}
              onValueChange={setSelectedDistrictName}
            >
              <SelectTrigger id="district-select">
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                {DISTRICT_PRESETS.map((p) => (
                  <SelectItem key={p.district} value={p.district}>
                    {p.district}, {p.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="gov-id-field">
              Government ID (Optional for Trust Score Boost)
            </Label>
            <div className="relative">
              <IdCard className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="gov-id-field"
                type="text"
                placeholder="Aadhaar / Voter ID / Officer Badge Ref"
                className="pl-9"
                value={governmentId}
                onChange={(e) => setGovernmentId(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-3"
            disabled={isLoading || !name || !email || !phone || !password}
          >
            {isLoading ? "Registering Official Profile..." : "Complete Registration"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="border-t border-slate-100 p-4 text-center justify-center text-xs text-slate-600">
        <span>Already registered with emergency services? </span>
        <Link
          href="/login"
          className="font-semibold text-slate-900 hover:underline ml-1"
        >
          Sign In Here &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
}
