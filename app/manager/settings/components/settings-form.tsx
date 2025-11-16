"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SettingsFormProps {
  centerId: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  visitReminders: boolean;
  newPatientAlerts: boolean;
  reportFrequency: string;
}

export function SettingsForm({ centerId }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    visitReminders: true,
    newPatientAlerts: true,
    reportFrequency: "weekly",
  });

  useEffect(() => {
    // Load saved settings
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/manager/settings");
        if (response.ok) {
          const data = await response.json();
          if (data.settings) {
            setSettings(data.settings);
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/manager/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setSuccess("Settings saved successfully");
    } catch (err: any) {
      setError(err.message || "Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: string, type: string) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/manager/export?type=${type}&format=${format}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(`${type} exported successfully`);
    } catch (err: any) {
      setError(err.message || "Failed to export data");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked as boolean })
              }
              disabled={isLoading}
            />
            <Label htmlFor="emailNotifications" className="cursor-pointer">
              Email notifications for important updates
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="smsNotifications"
              checked={settings.smsNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, smsNotifications: checked as boolean })
              }
              disabled={isLoading}
            />
            <Label htmlFor="smsNotifications" className="cursor-pointer">
              SMS notifications (requires phone number)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="visitReminders"
              checked={settings.visitReminders}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, visitReminders: checked as boolean })
              }
              disabled={isLoading}
            />
            <Label htmlFor="visitReminders" className="cursor-pointer">
              Visit reminders and scheduling alerts
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="newPatientAlerts"
              checked={settings.newPatientAlerts}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, newPatientAlerts: checked as boolean })
              }
              disabled={isLoading}
            />
            <Label htmlFor="newPatientAlerts" className="cursor-pointer">
              New patient enrollment alerts
            </Label>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="reportFrequency">Report Frequency</Label>
            <Select
              value={settings.reportFrequency}
              onValueChange={(value) =>
                setSettings({ ...settings, reportFrequency: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">
              How often you receive summary reports via email
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Data Export
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Export data for reporting and analysis. All exports comply with GDPR regulations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleExport("csv", "patients")}
            className="w-full"
          >
            Export Patients (CSV)
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleExport("csv", "visits")}
            className="w-full"
          >
            Export Visits (CSV)
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleExport("csv", "statistics")}
            className="w-full"
          >
            Export Statistics (CSV)
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Exports include only data from your center and are anonymized as appropriate
        </p>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </form>
  );
}

