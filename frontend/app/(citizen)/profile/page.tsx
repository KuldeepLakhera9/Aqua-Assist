"use client";

import * as React from "react";
import {
  User,
  Shield,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  BellRing,
  CheckCircle2,
  Lock,
  Save,
  Loader2,
  Building,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CitizenProfilePage() {
  const { user } = useAuth();

  // Profile Form State
  const [name, setName] = React.useState(user?.name || "Aarav Patel");
  const [email, setEmail] = React.useState(user?.email || "aarav.patel@example.com");
  const [phone, setPhone] = React.useState(user?.phone || "+91 98201 44321");
  const [district, setDistrict] = React.useState("Mumbai Suburban");
  const [ward, setWard] = React.useState("Ward L (Kurla)");
  const [address, setAddress] = React.useState("Flat 302, Sai Shraddha Apts, LBS Marg, Kurla West");

  // Medical & Special Needs
  const [bloodGroup, setBloodGroup] = React.useState("O+");
  const [medicalConditions, setMedicalConditions] = React.useState("Insulin-dependent diabetes; elderly parent with mobility limitation");
  const [emergencyContactName, setEmergencyContactName] = React.useState("Pooja Patel (Spouse)");
  const [emergencyContactPhone, setEmergencyContactPhone] = React.useState("+91 98205 99881");

  // Notification Preferences
  const [smsAlerts, setSmsAlerts] = React.useState(true);
  const [pushAlerts, setPushAlerts] = React.useState(true);
  const [sirenOverride, setSirenOverride] = React.useState(true);

  const [saving, setSaving] = React.useState(false);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Citizen Disaster Safety Profile & Aadhaar Registry
            </h1>
            <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-mono">
              DBT-LINKED
            </Badge>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Registered details are utilized by NDRF first responders and automated Disaster Relief (DBT) transfer systems.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4" />
            Safety Profile Synchronized
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Identity & Aadhaar Ledger */}
        <Card className="border-slate-200">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-700" />
              1. Verified Identity & Relief Ledger
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Linked to UIDAI Aadhaar for Direct Benefit Transfer of ex-gratia relief funds.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="prof-name" className="text-xs font-semibold text-slate-800">
                  Full Name (as per Aadhaar)
                </Label>
                <Input
                  id="prof-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-phone" className="text-xs font-semibold text-slate-800">
                  Registered Mobile Number
                </Label>
                <Input
                  id="prof-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="prof-email" className="text-xs font-semibold text-slate-800">
                  Email Address
                </Label>
                <Input
                  id="prof-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Masked Aadhaar Card */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Lock className="h-4 w-4 text-slate-600 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900">
                    UIDAI Aadhaar Number: <span className="font-mono">XXXX-XXXX-4912</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    NPCI Aadhaar Payment Bridge (APB) Active for Disaster DBT Grants
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-900 text-[10px] font-mono">
                ✓ E-KYC VERIFIED
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Evacuation & Residence Location */}
        <Card className="border-slate-200">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-700" />
              2. Residence & Assigned Evacuation Assembly Shelter
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Determines which flood sirens, local SMS dispatches, and emergency relief camps you belong to.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="res-district" className="text-xs font-semibold text-slate-800">
                  District
                </Label>
                <Input
                  id="res-district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="res-ward" className="text-xs font-semibold text-slate-800">
                  Municipal Ward / Taluka
                </Label>
                <Input
                  id="res-ward"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="res-addr" className="text-xs font-semibold text-slate-800">
                Primary Residence Address
              </Label>
              <Input
                id="res-addr"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            {/* Designated Evacuation Camp */}
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded flex items-start gap-2.5 text-xs text-blue-950">
              <Building className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <strong>Designated High-Ground Assembly Shelter: </strong>
                <span>Camp 08 — Kurla Municipal Senior Secondary School, SG Barve Marg (Capacity: 800 citizens, In-House Medical Unit & Potable Water Sump).</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Medical Emergency & Special Rescue Requirements */}
        <Card className="border-slate-200">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-red-600" />
              3. Medical Emergency Telemetry & Next-of-Kin Contacts
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Critical details accessible to NDRF boat rescue teams during water extractions.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="blood-group" className="text-xs font-semibold text-slate-800">
                  Blood Group
                </Label>
                <select
                  id="blood-group"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full h-9 rounded-sm border border-slate-300 bg-white px-3 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="A+">A+ Positive</option>
                  <option value="A-">A- Negative</option>
                  <option value="B+">B+ Positive</option>
                  <option value="B-">B- Negative</option>
                  <option value="O+">O+ Positive</option>
                  <option value="O-">O- Negative</option>
                  <option value="AB+">AB+ Positive</option>
                  <option value="AB-">AB- Negative</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="kin-name" className="text-xs font-semibold text-slate-800">
                  Next-of-Kin Name
                </Label>
                <Input
                  id="kin-name"
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="kin-phone" className="text-xs font-semibold text-slate-800">
                  Next-of-Kin Hotline Number
                </Label>
                <Input
                  id="kin-phone"
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="med-cond" className="text-xs font-semibold text-slate-800">
                Medical Needs / Wheelchair / Critical Medication Notes
              </Label>
              <textarea
                id="med-cond"
                rows={2}
                value={medicalConditions}
                onChange={(e) => setMedicalConditions(e.target.value)}
                className="w-full rounded-sm border border-slate-300 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Public Warning Notification Preferences */}
        <Card className="border-slate-200">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BellRing className="h-4 w-4 text-slate-700" />
              4. Emergency Broadcast & Early Warning Subscriptions
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Government flash warnings override silent device settings during Red Alert flash floods.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 space-y-3">
            <label className="flex items-center gap-3 p-2.5 rounded border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <div className="text-xs">
                <div className="font-semibold text-slate-900">National SMS Flash Alert Dispatch</div>
                <div className="text-slate-500">Deliver SMS advisories to registered mobile during impending river dam discharge.</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-2.5 rounded border border-slate-200 bg-slate-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={sirenOverride}
                onChange={(e) => setSirenOverride(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <div className="text-xs">
                <div className="font-semibold text-slate-900">High-Decibel Auditory Siren Override</div>
                <div className="text-slate-500">Play evacuation pulse tone on mobile device in the event of Category 4 flood cresting.</div>
              </div>
            </label>
          </CardContent>

          <CardFooter className="flex justify-end border-t border-slate-100 p-4 sm:p-5">
            <Button
              type="submit"
              disabled={saving}
              className="text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 px-6 h-9"
            >
              {saving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Updating Registry...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  Save Safety Registry Dossier
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
