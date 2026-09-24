"use client";

import * as React from "react";
import {
  Settings,
  Building,
  Phone,
  Radio,
  Bell,
  Save,
  CheckCircle2,
  Sliders,
  Shield,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function MunicipalitySettingsPage() {
  const [controlRoomPhone, setControlRoomPhone] = React.useState("022-22694725");
  const [dutyOfficerName, setDutyOfficerName] = React.useState("Er. Arvind Kulkarni, Chief Engineer (SWD)");
  const [dutyOfficerPhone, setDutyOfficerPhone] = React.useState("+91 98205 11940");
  const [smsThresholdRainfall, setSmsThresholdRainfall] = React.useState(65);
  const [autoPumpTriggerDepth, setAutoPumpTriggerDepth] = React.useState(0.75);
  const [saveToast, setSaveToast] = React.useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast("Municipal command office configuration saved & broadcast to civic field servers.");
    setTimeout(() => setSaveToast(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-slate-800 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">
              MUNICIPAL DISASTER MANAGEMENT CELL (DMC) CONFIGURATION
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Municipal Office Settings & Thresholds
          </h1>
          <p className="text-sm text-slate-600">
            Configure emergency control room dispatch lines, duty officer rosters, and automated flood alert thresholds.
          </p>
        </div>

        <Badge variant="outline" className="border-slate-300 font-mono text-xs py-1 px-2.5">
          MCGM DISASTER CELL
        </Badge>
      </div>

      {saveToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          {saveToast}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Contact Roster */}
        <Card className="border-slate-200">
          <CardHeader className="p-4 pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-600" />
              Emergency 24x7 Control Room Roster
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Main DMC Control Room Hotline:
                </label>
                <Input
                  value={controlRoomPhone}
                  onChange={(e) => setControlRoomPhone(e.target.value)}
                  className="h-8 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Designated Duty Officer:
                </label>
                <Input
                  value={dutyOfficerName}
                  onChange={(e) => setDutyOfficerName(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duty Officer Direct Mobile (Emergency Alert Dispatch):
              </label>
              <Input
                value={dutyOfficerPhone}
                onChange={(e) => setDutyOfficerPhone(e.target.value)}
                className="h-8 text-xs font-mono max-w-sm"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Automated Sensor Thresholds */}
        <Card className="border-slate-200">
          <CardHeader className="p-4 pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="h-4 w-4 text-amber-600" />
              Automated Telemetry Alert Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  SMS Flood Warning Precipitation Threshold (mm / hour):
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={smsThresholdRainfall}
                    onChange={(e) => setSmsThresholdRainfall(parseInt(e.target.value) || 50)}
                    className="h-8 text-xs font-mono font-bold w-24"
                    required
                  />
                  <span className="text-slate-500 font-mono text-[11px]">
                    Current: Extreme Rain Alert at ≥{smsThresholdRainfall}mm/h
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Automatic Sump Pump Trigger Depth (meters):
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.05"
                    value={autoPumpTriggerDepth}
                    onChange={(e) => setAutoPumpTriggerDepth(parseFloat(e.target.value) || 0.5)}
                    className="h-8 text-xs font-mono font-bold w-24"
                    required
                  />
                  <span className="text-slate-500 font-mono text-[11px]">
                    Pumps ignite when sump stage reaches ≥{autoPumpTriggerDepth}m
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="submit"
            variant="default"
            size="sm"
            className="text-xs font-semibold bg-slate-900 text-white"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Office Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
