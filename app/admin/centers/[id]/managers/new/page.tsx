"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Loader2, Mail } from "lucide-react";

export default function NewManagerPage() {
  const router = useRouter();
  const params = useParams();
  const centerId = params.id as string;

  const [centerName, setCenterName] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadCenter() {
      try {
        const response = await fetch(`/api/admin/centers/${centerId}`);
        if (response.ok) {
          const data = await response.json();
          setCenterName(data.center.name);
        }
      } catch (err) {
        console.error("Failed to load center", err);
      }
    }
    loadCenter();
  }, [centerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/invite-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          centerId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send invitation");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Invitation Sent!
              </h3>
              <p className="text-slate-600 mb-6">
                An invitation has been sent to{" "}
                <strong>{formData.email}</strong>
                {" "}to join as a Manager of {centerName}
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => setSuccess(false)}>
                  Send Another Invitation
                </Button>
                <Button onClick={() => router.push(`/admin/centers/${centerId}`)}>
                  Back to Center
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900">Invite Manager</h2>
        <p className="text-slate-600">
          Invite a manager for {centerName}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manager Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                placeholder="manager@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+33 1 23 45 67 89"
              />
            </div>

            {error && <AlertBanner type="error" message={error} />}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 text-sm mb-1">
                Manager Capabilities
              </h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Manage healthcare professionals in this center</li>
                <li>Full access to all patient records in this center</li>
                <li>View center-level statistics and analytics</li>
                <li>Grant and revoke permissions</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Invitation...
                  </>
                ) : (
                  "Send Invitation"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

