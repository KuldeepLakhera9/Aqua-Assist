"use client";

import * as React from "react";
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  PhoneCall,
  Clock,
  MapPin,
  CheckCircle2,
  Volume2,
  Radio,
  ExternalLink,
} from "lucide-react";
import { alertService } from "@/lib/services/alert-service";
import { DisasterAlert, AlertSeverity } from "@/types/alerts";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge, SeverityBadge } from "@/components/ui/badge";

export default function AlertsPage() {
  const [alerts, setAlerts] = React.useState<DisasterAlert[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedSeverity, setSelectedSeverity] = React.useState<string>("all");

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await alertService.getActiveAlerts();
      setAlerts(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredAlerts = React.useMemo(() => {
    if (selectedSeverity === "all") return alerts;
    return alerts.filter((a) => a.severity === selectedSeverity);
  }, [alerts, selectedSeverity]);

  const mapSeverityToBadgeLevel = (sev: AlertSeverity) => {
    if (sev === "critical") return "critical";
    if (sev === "high") return "high";
    if (sev === "medium") return "advisory";
    return "normal";
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Emergency Siren test */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Official Disaster Advisories & Early Warning Bulletins
            </h1>
            <Badge variant="outline" className="border-red-400 bg-red-50 text-red-900 text-xs font-mono font-bold">
              LIVE BROADCAST
            </Badge>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Authoritative early warnings issued by IMD, Central Water Commission (CWC), and the National Disaster Management Authority.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="text-xs h-9 border-slate-300"
            onClick={() => alert("Auditory Siren Test: Tone 850 Hz 3-cycle pulse triggered on device speakers.")}
          >
            <Volume2 className="h-3.5 w-3.5 mr-1.5 text-slate-700" />
            Test Public Siren Tone
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">
          Filter Bulletins:
        </span>
        {[
          { id: "all", label: "All Active Bulletins" },
          { id: "critical", label: "Red Alerts (Critical)" },
          { id: "high", label: "Orange Alerts (Severe)" },
          { id: "medium", label: "Yellow Advisories" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedSeverity(tab.id)}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              selectedSeverity === tab.id
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bulletins Feed */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500 font-mono">
          Connecting to State Emergency Operations Center feed...
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className="py-16 text-center bg-white rounded border border-slate-200 p-8 space-y-2">
          <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Active Warnings for Selected Tier</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            All hydrological monitoring points in this tier are within safe threshold parameters.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAlerts.map((alert) => (
            <Card
              key={alert._id || alert.id}
              className={`border transition-all ${
                alert.severity === "critical"
                  ? "border-red-300 bg-red-50/20 shadow-xs"
                  : alert.severity === "high"
                  ? "border-orange-300 bg-orange-50/20"
                  : "border-slate-200 bg-white"
              }`}
            >
              <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <SeverityBadge level={mapSeverityToBadgeLevel(alert.severity)} />
                    <span className="font-mono text-xs font-bold text-slate-700">
                      BULLETIN #{alert._id?.slice(-6).toUpperCase() || "NDMA"}
                    </span>
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Issued: {new Date(alert.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <Badge variant="outline" className="border-slate-300 bg-white text-slate-700 text-[10px] font-mono">
                    VALID UNTIL: {new Date(alert.validUntil).toLocaleString()}
                  </Badge>
                </div>

                <CardTitle className="text-lg font-bold text-slate-900 mt-3">
                  {alert.title}
                </CardTitle>
                <CardDescription className="text-xs text-slate-600 font-medium mt-0.5">
                  Issuing Agency: <strong className="text-slate-900">{alert.issuingAuthority}</strong>
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-4">
                {/* Geographic Affected Area */}
                {alert.targetArea && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Target Jurisdiction / Affected Zones: </strong>
                      <span className="text-slate-700">
                        {alert.targetArea.district} {alert.targetArea.description && `— ${alert.targetArea.description}`}
                      </span>
                    </div>
                  </div>
                )}

                {/* Bulletin Text */}
                <p className="text-xs text-slate-800 leading-relaxed font-sans">
                  {alert.message}
                </p>

                {/* Safety Guidelines */}
                {alert.safetyGuidelines && alert.safetyGuidelines.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <ShieldAlert className="h-3.5 w-3.5 text-blue-700" />
                      Mandatory Citizen Safety Guidelines
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {alert.safetyGuidelines.map((guideline, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded border border-slate-200 bg-white text-xs text-slate-700 flex items-start gap-2"
                        >
                          <span className="font-mono font-bold text-blue-700 shrink-0">
                            0{idx + 1}.
                          </span>
                          <span>{guideline}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 24/7 Helplines */}
                {alert.helplines && alert.helplines.length > 0 && (
                  <div className="pt-3 border-t border-slate-200/80">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Emergency Hotlines for this Zone
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {alert.helplines.map((helpline, idx) => (
                        <a
                          key={idx}
                          href={`tel:${helpline.number}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-900 transition-colors shadow-2xs"
                        >
                          <PhoneCall className="h-3.5 w-3.5 text-emerald-700" />
                          <span>{helpline.name}: <strong>{helpline.number}</strong></span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
