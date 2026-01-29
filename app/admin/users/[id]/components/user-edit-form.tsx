"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserProfile, Center } from "@/lib/types/database.types";

type UserRoleType = "administrator" | "manager" | "healthcare_professional" | "patient";

interface UserEditFormProps {
  user: UserProfile & {
    centers?: {
      id: string;
      name: string;
      code: string;
    } | null;
    user_pathologies?: { pathology_id: string }[];
  };
  email: string;
  centers: Center[];
  pathologies: { id: string; name: string; type: string }[];
  centerPathologyMappings: { center_id: string; pathology_id: string }[];
}

const ROLES: { value: UserRoleType; label: string }[] = [
  { value: "administrator", label: "Administrator" },
  { value: "manager", label: "Manager" },
  { value: "healthcare_professional", label: "Healthcare Professional" },
  { value: "patient", label: "Patient" },
];

export function UserEditForm({ user, email, centers, pathologies, centerPathologyMappings }: UserEditFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [userEmail, setUserEmail] = useState(email);
  const [phone, setPhone] = useState(user.phone || "");
  const [username, setUsername] = useState(user.username || "");
  const [role, setRole] = useState<UserRoleType>(user.role as UserRoleType);
  const [centerId, setCenterId] = useState<string>(user.center_id || "");
  const [active, setActive] = useState(user.active);
  const [selectedPathologies, setSelectedPathologies] = useState<string[]>(
    user.user_pathologies?.map(up => up.pathology_id) || []
  );

  // Clear pathologies that are not assigned to the new center when centerId changes
  useEffect(() => {
    if (!centerId) return;

    const validPathologyIds = centerPathologyMappings
      .filter((m) => m.center_id === centerId)
      .map((m) => m.pathology_id);

    setSelectedPathologies((prev) => 
      prev.filter((id) => validPathologyIds.includes(id))
    );
  }, [centerId, centerPathologyMappings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required");
      setIsLoading(false);
      return;
    }

    if (!userEmail.includes("@")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Validate center assignment based on role
    if (role !== "administrator" && !centerId) {
      setError("Non-administrator users must be assigned to a center");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: userEmail.trim(),
          phone: phone.trim() || null,
          username: username.trim() || null,
          role,
          center_id: role === "administrator" ? null : centerId || null,
          active,
          pathologies: selectedPathologies,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      setSuccess("User updated successfully");
      router.refresh();
      setTimeout(() => {
        router.push("/admin/users");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to update user");
    } finally {
      setIsLoading(false);
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
          Personal Information
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
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
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Role & Access
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRoleType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {role !== "administrator" && (
            <div className="space-y-2">
              <Label htmlFor="center">
                Center <span className="text-red-500">*</span>
              </Label>
              <Select value={centerId} onValueChange={setCenterId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a center" />
                </SelectTrigger>
                <SelectContent>
                  {centers.map((center) => (
                    <SelectItem key={center.id} value={center.id}>
                      {center.name} ({center.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="active"
              checked={active}
              onCheckedChange={(checked) => setActive(checked as boolean)}
              disabled={isLoading}
            />
            <Label htmlFor="active" className="cursor-pointer">
              Active (User can login and access the system)
            </Label>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Pathology Assignments
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Select the pathologies this user is authorized to manage or access.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pathologies
            .filter((pathology) => {
              // Administrators see all pathologies.
              // Other roles are filtered by center if one is selected.
              if (role === "administrator" || !centerId) return true;
              
              return centerPathologyMappings.some(
                (m) => m.center_id === centerId && m.pathology_id === pathology.id
              );
            })
            .map((pathology) => (
            <div key={pathology.id} className="flex items-center space-x-2">
              <Checkbox
                id={`pathology-${pathology.id}`}
                checked={selectedPathologies.includes(pathology.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedPathologies([...selectedPathologies, pathology.id]);
                  } else {
                    setSelectedPathologies(selectedPathologies.filter(id => id !== pathology.id));
                  }
                }}
                disabled={isLoading}
              />
              <Label htmlFor={`pathology-${pathology.id}`} className="cursor-pointer">
                {pathology.name}
              </Label>
            </div>
          ))}
          {pathologies.length === 0 && (
            <p className="text-sm text-slate-400 italic col-span-2">
              No pathologies available in the system.
            </p>
          )}
        </div>
      </Card>

      <Card className="p-6 bg-slate-50">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Account Information
        </h3>
        <div className="text-sm text-slate-600 space-y-1">
          <p><strong>User ID:</strong> <span className="font-mono">{user.id}</span></p>
          <p><strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
          {user.created_by && (
            <p><strong>Created by:</strong> {user.created_by}</p>
          )}
        </div>
      </Card>

      <div className="flex justify-between">
        <Link href="/admin/users">
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

