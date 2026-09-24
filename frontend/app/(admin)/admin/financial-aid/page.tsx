"use client";

import * as React from "react";
import {
  Banknote,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Search,
  Filter,
  CreditCard,
  Building,
  ShieldCheck,
  Send,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge, SeverityBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface GrantBeneficiary {
  id: string;
  claimantName: string;
  aadhaarMasked: string;
  ward: string;
  damageTier: "household" | "structural" | "business";
  grantAmount: number;
  bankAccount: string;
  ifscCode: string;
  status: "disbursed" | "approved" | "pending_inspection" | "rejected";
  verifiedAt?: string;
  disbursedAt?: string;
}

const BENEFICIARY_CLAIMS: GrantBeneficiary[] = [
  {
    id: "DBT-2026-081",
    claimantName: "Smt. Sunita Ramesh Gaikwad",
    aadhaarMasked: "XXXX-XXXX-4819",
    ward: "Ward L (Kranti Nagar)",
    damageTier: "structural",
    grantAmount: 50000,
    bankAccount: "SBIN0001248-XXXX381",
    ifscCode: "SBIN0001248",
    status: "approved",
    verifiedAt: "24 Sep 2026, 09:30",
  },
  {
    id: "DBT-2026-082",
    claimantName: "Shri Santosh Narayan Shinde",
    aadhaarMasked: "XXXX-XXXX-9124",
    ward: "Ward F-North (Hindmata)",
    damageTier: "household",
    grantAmount: 15000,
    bankAccount: "BARB0DADAR-XXXX902",
    ifscCode: "BARB0DADAR",
    status: "disbursed",
    verifiedAt: "23 Sep 2026, 14:15",
    disbursedAt: "24 Sep 2026, 08:00 (NPCI Txn #9812491)",
  },
  {
    id: "DBT-2026-083",
    claimantName: "Shri Mohammed Rizwan Ansari",
    aadhaarMasked: "XXXX-XXXX-3301",
    ward: "Ward L (Kurla West)",
    damageTier: "business",
    grantAmount: 100000,
    bankAccount: "HDFC0000412-XXXX110",
    ifscCode: "HDFC0000412",
    status: "pending_inspection",
  },
  {
    id: "DBT-2026-084",
    claimantName: "Smt. Kavita Pradeep Jadhav",
    aadhaarMasked: "XXXX-XXXX-7728",
    ward: "Ward G-North (Dadar)",
    damageTier: "household",
    grantAmount: 15000,
    bankAccount: "MAHB0000183-XXXX654",
    ifscCode: "MAHB0000183",
    status: "disbursed",
    verifiedAt: "23 Sep 2026, 17:40",
    disbursedAt: "24 Sep 2026, 08:00 (NPCI Txn #9812494)",
  },
  {
    id: "DBT-2026-085",
    claimantName: "Shri Vinod Balwant More",
    aadhaarMasked: "XXXX-XXXX-5512",
    ward: "Ward K-West (Andheri)",
    damageTier: "household",
    grantAmount: 15000,
    bankAccount: "PUNB0182400-XXXX821",
    ifscCode: "PUNB0182400",
    status: "approved",
    verifiedAt: "24 Sep 2026, 10:10",
  },
];

export default function AdminFinancialAidPage() {
  const [claims, setClaims] = React.useState<GrantBeneficiary[]>(BENEFICIARY_CLAIMS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [isDisbursing, setIsDisbursing] = React.useState(false);
  const [auditMessage, setAuditMessage] = React.useState<string | null>(null);

  const filteredClaims = claims.filter((item) => {
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    const matchesSearch =
      item.claimantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ward.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalDisbursed = claims
    .filter((c) => c.status === "disbursed")
    .reduce((acc, curr) => acc + curr.grantAmount, 0);

  const pendingDisbursement = claims
    .filter((c) => c.status === "approved")
    .reduce((acc, curr) => acc + curr.grantAmount, 0);

  const handleDisburseBatch = () => {
    setIsDisbursing(true);
    setTimeout(() => {
      setClaims((prev) =>
        prev.map((c) =>
          c.status === "approved"
            ? {
                ...c,
                status: "disbursed",
                disbursedAt: `24 Sep 2026, ${new Date().toLocaleTimeString()} (NPCI Batch #TX-${Math.floor(
                  Math.random() * 900000 + 100000
                )})`,
              }
            : c
        )
      );
      setIsDisbursing(false);
      setAuditMessage("Direct Benefit Transfer (DBT) batch successfully signed & transmitted to NPCI clearing gateway.");
      setTimeout(() => setAuditMessage(null), 5000);
    }, 1500);
  };

  const handleApproveSingle = (id: string) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "approved",
              verifiedAt: `24 Sep 2026, ${new Date().toLocaleTimeString()}`,
            }
          : c
      )
    );
    setAuditMessage(`Claim ${id} certified by Revenue Assessor and queued for NPCI disbursement.`);
    setTimeout(() => setAuditMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Financial Aid Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              STATE DISASTER RELIEF FUND (SDRF) • DIRECT BENEFIT TRANSFER
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Financial Relief Grants & Beneficiary DBT Clearance
          </h1>
          <p className="text-sm text-slate-600">
            Aadhaar-authenticated ex-gratia relief disbursements processed through the National Automated Clearing House (NACH / NPCI).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-900 font-mono text-xs py-1 px-2.5">
            TREASURY SANCTION: ₹50,00,000
          </Badge>
          <Button
            variant="default"
            size="sm"
            onClick={handleDisburseBatch}
            disabled={isDisbursing || pendingDisbursement === 0}
            className="text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            {isDisbursing ? "Processing NACH..." : `Disburse Approved Batch (₹${pendingDisbursement.toLocaleString()})`}
          </Button>
        </div>
      </div>

      {auditMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          {auditMessage}
        </div>
      )}

      {/* Financial Ticker Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Disbursed Ex-Gratia</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-700 mt-1">
            ₹{totalDisbursed.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium">Credited to Beneficiary Accounts</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Approved for Payout</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-blue-700 mt-1">
            ₹{pendingDisbursement.toLocaleString()}
          </div>
          <div className="text-[11px] text-blue-700 font-medium">Awaiting NACH batch trigger</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Beneficiaries Registered</span>
            <Banknote className="h-4 w-4 text-slate-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">{claims.length} Citizens</div>
          <div className="text-[11px] text-slate-500">100% Aadhaar DBT Linked</div>
        </div>

        <div className="p-3 bg-white rounded border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Aadhaar Linkage Rate</span>
            <ShieldCheck className="h-4 w-4 text-teal-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-900 mt-1">99.4%</div>
          <div className="text-[11px] text-teal-700 font-medium">Verified against UIDAI DB</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "all", label: "All Claims" },
            { id: "approved", label: "Approved (Ready)" },
            { id: "disbursed", label: "Disbursed" },
            { id: "pending_inspection", label: "Pending Assessment" },
          ].map((cat) => (
            <Button
              key={cat.id}
              variant={selectedStatus === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(cat.id)}
              className="text-xs h-7 shrink-0"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Search claimant name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* Beneficiary Master Table */}
      <Card className="border-slate-200">
        <CardHeader className="p-4 pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">
              Statutory DBT Beneficiary Ledger
            </CardTitle>
            <p className="text-xs text-slate-500">
              Certified by District Revenue Officer & Sub-Divisional Magistrate
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {filteredClaims.length} CLAIM RECORDS
          </Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Claim ID & Claimant</th>
                <th className="py-2.5 px-4">Aadhaar Linkage</th>
                <th className="py-2.5 px-4">Ward / Sector</th>
                <th className="py-2.5 px-4">Damage Classification</th>
                <th className="py-2.5 px-4 text-right">Sanctioned Amount</th>
                <th className="py-2.5 px-4">Status & Telemetry</th>
                <th className="py-2.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredClaims.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.claimantName}</div>
                    <div className="text-[10px] font-mono text-slate-500">{item.id}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">
                    <div>{item.aadhaarMasked}</div>
                    <div className="text-[10px] text-teal-700 font-semibold">UIDAI Verified</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{item.ward}</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="uppercase font-mono text-[10px]">
                      {item.damageTier === "household"
                        ? "Immediate Ex-Gratia"
                        : item.damageTier === "structural"
                        ? "Structural Damage"
                        : "Business Inundation"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800 text-sm">
                    ₹{item.grantAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-[11px]">
                    {item.status === "disbursed" ? (
                      <div>
                        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px]">
                          PAID VIA NPCI
                        </span>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.disbursedAt}</div>
                      </div>
                    ) : item.status === "approved" ? (
                      <div>
                        <span className="font-mono font-bold text-blue-800 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded text-[10px]">
                          APPROVED FOR PAYOUT
                        </span>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">Verified: {item.verifiedAt}</div>
                      </div>
                    ) : (
                      <span className="font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[10px]">
                        AWAITING REVENUE VERIFICATION
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.status === "pending_inspection" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApproveSingle(item.id)}
                        className="text-xs h-7 px-2 font-semibold border-slate-300 text-blue-700"
                      >
                        Certify Claim
                      </Button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">Certified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
