"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Center } from "@/lib/types/database.types";
import { PathologyType } from "@/lib/types/enums";

interface CenterEditFormProps {
  center: Center;
  assignedPathologies: PathologyType[];
}

const PATHOLOGIES: { value: PathologyType; label: string }[] = [
  { value: "bipolar", label: "Bipolar Disorder" },
  { value: "schizophrenia", label: "Schizophrenia" },
  { value: "asd_asperger", label: "Autism Spectrum Disorder - Asperger" },
  { value: "depression", label: "Depression" },
];

export function CenterEditForm({ center, assignedPathologies }: CenterEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState(center.name);
  const [code, setCode] = useState(center.code);
  const [city, setCity] = useState(center.city || "");
  const [address, setAddress] = useState(center.address || "");
  const [phone, setPhone] = useState(center.phone || "");
  const [email, setEmail] = useState(center.email || "");
  const [active, setActive] = useState(center.active);
  const [selectedPathologies, setSelectedPathologies] = useState<PathologyType[]>(assignedPathologies);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (!name.trim() || !code.trim()) {
      setError("Name and code are required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/centers/${center.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim().toUpperCase(),
          city: city.trim() || null,
          address: address.trim() || null,
          phone: phone.trim() || null,
          email: email.trim() || null,
          active,
          pathologies: selectedPathologies,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update center");
      }

      router.push(`/admin/centers/${center.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update center");
    } finally {
      setIsLoading(false);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Basic Information
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Center Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">
                Center Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                disabled={isLoading}
                placeholder="CEF-PARIS"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                placeholder="+33 1 23 45 67 89"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="contact@center.fr"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="active"
              checked={active}
              onCheckedChange={(checked) => setActive(checked as boolean)}
              disabled={isLoading}
            />
            <Label htmlFor="active" className="cursor-pointer">
              Active
            </Label>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Assigned Pathologies
        </h3>
        <div className="space-y-3">
          {PATHOLOGIES.map((pathology) => (
            <div key={pathology.value} className="flex items-center space-x-2">
              <Checkbox
                id={pathology.value}
                checked={selectedPathologies.includes(pathology.value)}
                onCheckedChange={() => togglePathology(pathology.value)}
                disabled={isLoading}
              />
              <Label htmlFor={pathology.value} className="cursor-pointer">
                {pathology.label}
              </Label>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-between">
        <Link href={`/admin/centers/${center.id}`}>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

