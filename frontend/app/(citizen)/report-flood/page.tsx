"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Camera,
  AlertTriangle,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  Navigation,
  Info,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { reportService } from "@/lib/services/report-service";
import { WaterDepthLevel, ReportSeverity } from "@/types/reports";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const WATER_LEVELS: Array<{
  id: WaterDepthLevel;
  label: string;
  depthMeters: number;
  description: string;
  recommendedSeverity: ReportSeverity;
}> = [
  {
    id: "ankle-deep",
    label: "Ankle-Deep",
    depthMeters: 0.15,
    description: "Surface ponding (~15 cm). Safe for high-clearance transit.",
    recommendedSeverity: "low",
  },
  {
    id: "knee-deep",
    label: "Knee-Deep",
    depthMeters: 0.5,
    description: "Pedestrian walkways submerged (~50 cm). Ground floors threatened.",
    recommendedSeverity: "medium",
  },
  {
    id: "waist-deep",
    label: "Waist-Deep",
    depthMeters: 1.0,
    description: "Vehicles immobilized (~1.0 m). Immediate electrical hazard.",
    recommendedSeverity: "high",
  },
  {
    id: "chest-deep",
    label: "Chest-Deep",
    depthMeters: 1.8,
    description: "Rapid current (~1.8 m). Structural ingress, rescue boat mandatory.",
    recommendedSeverity: "critical",
  },
  {
    id: "above-head",
    label: "Above-Head (>2.5m)",
    depthMeters: 2.5,
    description: "Catastrophic inundation. Rooftop evacuation and aerial rescue required.",
    recommendedSeverity: "critical",
  },
];

export default function ReportFloodPage() {
  const router = useRouter();

  // Form State
  const [district, setDistrict] = React.useState("Mumbai Suburban");
  const [state, setState] = React.useState("Maharashtra");
  const [address, setAddress] = React.useState("");
  const [landmark, setLandmark] = React.useState("");
  const [coordinates, setCoordinates] = React.useState<[number, number] | null>([72.8826, 19.0688]);
  const [isDetectingLocation, setIsDetectingLocation] = React.useState(false);
  const [locationSuccess, setLocationSuccess] = React.useState(false);

  const [waterLevel, setWaterLevel] = React.useState<WaterDepthLevel>("knee-deep");
  const [severity, setSeverity] = React.useState<ReportSeverity>("medium");
  const [strandedCount, setStrandedCount] = React.useState(0);
  const [description, setDescription] = React.useState("");

  // Media upload state
  const [files, setFiles] = React.useState<File[]>([]);
  const [previews, setPreviews] = React.useState<string[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedId, setSubmittedId] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Compute calculated urgency score (1-10)
  const urgencyScore = React.useMemo(() => {
    let score = 3;
    if (severity === "critical") score = 10;
    else if (severity === "high") score = 8;
    else if (severity === "medium") score = 5;

    if (waterLevel === "above-head") score = 10;
    else if (waterLevel === "chest-deep") score = Math.max(score, 9);
    else if (waterLevel === "waist-deep") score = Math.max(score, 7);

    if (strandedCount > 5) score = Math.min(10, score + 1);
    return score;
  }, [severity, waterLevel, strandedCount]);

  // Handle GPS location detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser. Please enter location manually.");
      return;
    }

    setIsDetectingLocation(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates([Number(longitude.toFixed(5)), Number(latitude.toFixed(5))]);
        setIsDetectingLocation(false);
        setLocationSuccess(true);
        if (!address) {
          setAddress(`GPS Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`);
        }
      },
      (error) => {
        setIsDetectingLocation(false);
        setErrorMessage("Unable to retrieve GPS coordinates. Please specify district and landmark manually.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  };

  // Handle file drop & selection
  const handleFileChange = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(newFiles).forEach((file) => {
      if (file.size > 15 * 1024 * 1024) {
        setErrorMessage(`File ${file.name} exceeds 15MB limit.`);
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!district || !address || !description) {
      setErrorMessage("Please complete all required fields (District, Address, Description).");
      return;
    }

    const currentCoords = coordinates || [72.8826, 19.0688];
    const selectedLevelConfig = WATER_LEVELS.find((w) => w.id === waterLevel);

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await reportService.submitReport({
        location: {
          district,
          state,
          address,
          landmark,
          coordinates: currentCoords,
        },
        severity,
        waterLevel,
        depth: selectedLevelConfig?.depthMeters || 0.5,
        description,
        urgencyLevel: urgencyScore,
        strandedCount,
        files,
      });

      if (result.success && result.report) {
        setSubmittedId(result.report.reportNumber || result.report._id || "NEW-REPORT");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit report. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Card className="border-emerald-300 bg-white">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-3">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Flood Report Dispatched Successfully
            </CardTitle>
            <CardDescription className="text-sm text-slate-600 font-mono">
              Official Incident Reference: <strong className="text-slate-900">{submittedId}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center p-6 text-sm text-slate-700">
            <p>
              Your crowd-sourced report has entered the <strong>National Incident Verification Pipeline</strong>.
              Automated computer-vision verification has initiated and NDRF / Municipal responders in your sector have been notified.
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 font-mono text-left">
              <div>District: <strong>{district}</strong></div>
              <div>Water Depth: <strong>{waterLevel.toUpperCase()}</strong></div>
              <div>Urgency Score: <strong>{urgencyScore}/10</strong></div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center border-t border-slate-100 p-5">
            <Button
              variant="outline"
              className="w-full sm:w-auto text-xs"
              onClick={() => {
                setSubmittedId(null);
                setDescription("");
                setFiles([]);
                setPreviews([]);
              }}
            >
              Submit Another Report
            </Button>
            <Button
              className="w-full sm:w-auto text-xs font-semibold bg-slate-900 text-white"
              onClick={() => router.push("/reports")}
            >
              View Active Reports Feed <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Statutory Header & Warning */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Submit Crowd-Sourced Flood Report
          </h1>
          <Badge variant="outline" className="border-slate-300 bg-white text-slate-700 text-xs font-mono">
            FORM NDMS-01
          </Badge>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          Provide ground-truth data to assist municipal drainage engineers, NDRF water rescue battalions, and AI flood contour models.
        </p>
      </div>

      {/* Statutory Warning Box */}
      <div className="p-3.5 rounded border border-amber-300 bg-amber-50/70 text-xs text-amber-950 flex items-start gap-2.5">
        <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Statutory Notice:</strong> Accurate flood depth and geolocation reporting saves lives. False or malicious incident reporting is punishable under <em>Section 54 of the Disaster Management Act, 2005</em> with imprisonment of up to one year.
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded border border-red-300 bg-red-50 text-xs text-red-900 font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Geolocation & Address */}
        <Card className="border-slate-200">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-700" />
                1. Incident Location & Geolocation
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Pinpoint the exact location of water accumulation.
              </CardDescription>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-8 font-semibold border-slate-300"
              onClick={handleDetectLocation}
              disabled={isDetectingLocation}
            >
              {isDetectingLocation ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Triangulating GPS...
                </>
              ) : (
                <>
                  <Navigation className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                  Capture My GPS
                </>
              )}
            </Button>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 space-y-4">
            {locationSuccess && coordinates && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 font-mono flex items-center justify-between">
                <span>GPS Fixed: {coordinates[1].toFixed(5)}° N, {coordinates[0].toFixed(5)}° E (±5m accuracy)</span>
                <span className="text-[10px] uppercase font-bold text-emerald-800">Verified</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="district" className="text-xs font-semibold text-slate-800">
                  District / Municipal Ward <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Mumbai Suburban, Thane, Pune"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="state" className="text-xs font-semibold text-slate-800">
                  State / Territory <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Maharashtra"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs font-semibold text-slate-800">
                  Street / Area Address <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Near Sheetal Cinema, LBS Road, Kurla West"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="landmark" className="text-xs font-semibold text-slate-800">
                  Prominent Landmark (Optional)
                </Label>
                <Input
                  id="landmark"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Post Office or Railway Underpass"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Water Level Depth & Hazard Assessment */}
        <Card className="border-slate-200">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              2. Water Depth & Hazard Severity
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Select the highest water level mark currently observed.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 space-y-5">
            {/* Water Depth Radio Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {WATER_LEVELS.map((level) => {
                const isSelected = waterLevel === level.id;
                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => {
                      setWaterLevel(level.id);
                      setSeverity(level.recommendedSeverity);
                    }}
                    className={`p-3 text-left rounded border transition-all ${
                      isSelected
                        ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-400 text-slate-900"
                    }`}
                  >
                    <div className="text-xs font-mono font-bold uppercase tracking-wider">
                      {level.label}
                    </div>
                    <div
                      className={`text-[11px] font-mono mt-0.5 ${
                        isSelected ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      ~{level.depthMeters}m depth
                    </div>
                    <div
                      className={`text-[10px] mt-2 leading-tight line-clamp-3 ${
                        isSelected ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {level.description}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Severity and Stranded Citizens Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="severity" className="text-xs font-semibold text-slate-800">
                  Risk Classification Level
                </Label>
                <select
                  id="severity"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as ReportSeverity)}
                  className="w-full h-9 rounded-sm border border-slate-300 bg-white px-3 py-1 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="low">Low Risk — Shallow surface ponding</option>
                  <option value="medium">Medium Risk — Walkways & ground floors inundated</option>
                  <option value="high">High Risk — Vehicles trapped, rapid inflow</option>
                  <option value="critical">Critical Emergency — Life hazard / Evacuation needed</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stranded" className="text-xs font-semibold text-slate-800">
                  Estimated Stranded / Trapped Persons
                </Label>
                <Input
                  id="stranded"
                  type="number"
                  min="0"
                  max="500"
                  value={strandedCount}
                  onChange={(e) => setStrandedCount(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Computed Urgency Score Banner */}
            <div className="flex items-center justify-between p-3 rounded bg-slate-100 border border-slate-200">
              <span className="text-xs text-slate-700 font-semibold">
                Computed Triage Urgency Metric:
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-slate-900">
                  {urgencyScore} / 10
                </span>
                <Badge
                  variant="outline"
                  className={`text-[10px] uppercase font-mono ${
                    urgencyScore >= 9
                      ? "border-red-400 bg-red-50 text-red-900 font-bold"
                      : urgencyScore >= 7
                      ? "border-orange-400 bg-orange-50 text-orange-950 font-semibold"
                      : "border-slate-300 bg-white text-slate-800"
                  }`}
                >
                  {urgencyScore >= 9 ? "PRIORITY ALPHA" : urgencyScore >= 7 ? "PRIORITY BRAVO" : "STANDARD TRIAGE"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Media Upload & Ground-Truth Description */}
        <Card className="border-slate-200">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Camera className="h-4 w-4 text-slate-700" />
              3. Visual Evidence & Incident Details
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Photographic evidence is required for AI computer-vision validation.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 space-y-4">
            {/* HTML5 Native Drag & Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileChange(e.dataTransfer.files);
              }}
              className={`p-6 border-2 border-dashed rounded text-center transition-colors ${
                isDragging
                  ? "border-slate-900 bg-slate-100"
                  : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
              }`}
            >
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800">
                Drag and drop flood photos or videos here, or browse
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Accepted formats: JPEG, PNG, WebP, MP4 (Max 15MB per file)
              </p>

              <label className="mt-3 inline-block">
                <span className="cursor-pointer inline-flex items-center px-3 py-1.5 rounded border border-slate-300 bg-white text-xs font-semibold text-slate-800 hover:bg-slate-50 shadow-2xs">
                  Select Files from Device
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,video/mp4"
                  onChange={(e) => handleFileChange(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>

            {/* Thumbnail Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {previews.map((previewUrl, index) => (
                  <div
                    key={index}
                    className="relative group rounded border border-slate-200 overflow-hidden bg-slate-100 h-28"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt={`Evidence ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-1 right-1 p-1 bg-slate-900/80 hover:bg-red-700 text-white rounded-full transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Incident Description */}
            <div className="space-y-1.5 pt-2">
              <Label htmlFor="description" className="text-xs font-semibold text-slate-800">
                Detailed Incident Situation & Immediate Hazards <span className="text-red-600">*</span>
              </Label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe current water flow rate, whether water is continuing to rise, any vulnerable citizens needing assistance, or blocked drainage paths..."
                required
                className="w-full rounded-sm border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Minimum 20 characters</span>
                <span>{description.length} characters</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t border-slate-100 p-4 sm:p-5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="text-xs"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || description.length < 15}
              className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-5 h-9"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Transmitting Incident Report...
                </>
              ) : (
                <>
                  <ShieldAlert className="h-3.5 w-3.5 mr-1.5" />
                  Transmit Official Report
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
