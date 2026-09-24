"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  Banknote,
  LifeBuoy,
  Info,
  Check,
} from "lucide-react";
import { alertService } from "@/lib/services/alert-service";
import { UserNotification } from "@/types/alerts";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<UserNotification[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [unreadOnly, setUnreadOnly] = React.useState(false);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await alertService.getUserNotifications();
      setNotifications(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleMarkRead = async (id: string) => {
    await alertService.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id || n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filtered = unreadOnly ? notifications.filter((n) => !n.isRead) : notifications;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIconForType = (type: UserNotification["type"]) => {
    switch (type) {
      case "alert":
        return <ShieldAlert className="h-4 w-4 text-red-600" />;
      case "relief_grant":
        return <Banknote className="h-4 w-4 text-emerald-600" />;
      case "sos_dispatch":
        return <LifeBuoy className="h-4 w-4 text-orange-600" />;
      case "report_status":
        return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
      default:
        return <Info className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Personal Disaster Notifications & Dispatches
            </h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs font-mono">
                {unreadCount} Unread
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Complete audit trail of SMS alerts, push advisories, and relief grant notices dispatched to your profile.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUnreadOnly(!unreadOnly)}
            className="text-xs h-8"
          >
            {unreadOnly ? "Show All Notifications" : "Filter Unread Only"}
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-xs h-8"
            >
              <Check className="h-3.5 w-3.5 mr-1" />
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500 font-mono">
          Loading authenticated citizen notification center...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded border border-slate-200 p-8 space-y-2">
          <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">All Notifications Acknowledged</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            You have no pending emergency notifications or unread dispatches.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const notifId = item._id || item.id || "";
            return (
              <Card
                key={notifId}
                className={`transition-all ${
                  item.isRead
                    ? "border-slate-200 bg-white opacity-85"
                    : "border-slate-300 bg-blue-50/20 shadow-2xs"
                }`}
              >
                <CardContent className="p-4 sm:p-5 flex items-start gap-3.5">
                  <div className="p-2 rounded bg-slate-100 shrink-0 mt-0.5">
                    {getIconForType(item.type)}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        {item.title}
                        {!item.isRead && (
                          <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                        )}
                      </h3>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 font-mono">
                      <span>Channel: {item.channel.toUpperCase()}</span>
                      <span>• Priority: {item.priority.toUpperCase()}</span>
                    </div>

                    {item.actionUrl && (
                      <div className="pt-2">
                        <Link
                          href={item.actionUrl}
                          className="text-xs font-semibold text-blue-700 hover:underline inline-flex items-center gap-1"
                        >
                          View Related Incident Dossier <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {!item.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkRead(notifId)}
                      className="text-[11px] h-7 px-2 text-slate-500 hover:text-slate-900 shrink-0"
                    >
                      Mark read
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
