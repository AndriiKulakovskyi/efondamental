import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertBanner } from "@/components/ui/alert-banner";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Platform Settings</h2>
        <p className="text-slate-600">Configure platform-wide settings and policies</p>
      </div>

      <AlertBanner
        type="info"
        message="Platform settings configuration will be available in the next release."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>RBAC Templates</CardTitle>
            <CardDescription>Manage role-based access control templates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Configure default permissions for each role</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
            <CardDescription>Configure data retention policies</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Set retention periods for clinical data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Security and authentication settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Password policies, session timeout, 2FA</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Email and notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Configure system notifications</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

