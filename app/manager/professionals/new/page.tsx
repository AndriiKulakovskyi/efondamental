"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Loader2, Mail } from "lucide-react";

export default function NewProfessionalPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/manager/invite-professional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
                An invitation email has been sent to{" "}
                <strong>{formData.email}</strong>
              </p>
              <p className="text-sm text-slate-500 mb-6">
                They will receive an email with a secure link to create their account.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => setSuccess(false)}>
                  Send Another Invitation
                </Button>
                <Button onClick={() => router.push("/manager/professionals")}>
                  View All Professionals
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
        <h2 className="text-3xl font-bold text-slate-900">Invite Healthcare Professional</h2>
        <p className="text-slate-600">Send an invitation to join your center</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
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
                placeholder="professional@example.com"
              />
              <p className="text-xs text-slate-500">
                The invitation will be sent to this email address
              </p>
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
                What happens next?
              </h4>
              <p className="text-sm text-blue-800">
                The professional will receive an email with a secure link to create their account and set their password. The invitation is valid for 7 days.
              </p>
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

