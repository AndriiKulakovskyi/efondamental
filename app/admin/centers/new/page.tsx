"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PATHOLOGY_NAMES, PathologyType } from "@/lib/types/enums";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Loader2 } from "lucide-react";

export default function NewCenterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    city: "",
    address: "",
    phone: "",
    email: "",
  });
  const [selectedPathologies, setSelectedPathologies] = useState<PathologyType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedPathologies.length === 0) {
      setError("Please select at least one pathology");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/centers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pathologies: selectedPathologies,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create center");
      }

      router.push("/admin/centers");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePathology = (pathology: PathologyType) => {
    setSelectedPathologies((prev) =>
      prev.includes(pathology)
        ? prev.filter((p) => p !== pathology)
        : [...prev, pathology]
    );
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900">Create Center</h2>
        <p className="text-slate-600">Add a new Expert Center to the platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Center Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Center Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Centre Expert FondaMental Paris"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Center Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  required
                  placeholder="CEF-PARIS"
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="Paris"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="40 Rue de Mesly, 94000 Créteil"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+33 1 49 81 30 00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="contact@center.fr"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Pathologies *</Label>
              <div className="space-y-2 border rounded-lg p-4">
                {Object.values(PathologyType).map((pathology) => (
                  <div key={pathology} className="flex items-center space-x-2">
                    <Checkbox
                      id={pathology}
                      checked={selectedPathologies.includes(pathology)}
                      onCheckedChange={() => togglePathology(pathology)}
                    />
                    <label
                      htmlFor={pathology}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {PATHOLOGY_NAMES[pathology]}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {error && <AlertBanner type="error" message={error} />}

            <div className="flex justify-end gap-3">
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
                    Creating...
                  </>
                ) : (
                  "Create Center"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

