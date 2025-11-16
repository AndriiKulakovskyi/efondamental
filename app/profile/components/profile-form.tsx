"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProfileFormProps {
  initialProfile: {
    first_name: string;
    last_name: string;
    phone: string;
    username: string;
  };
  initialEmail: string;
  dashboardUrl: string;
}

export function ProfileForm({ initialProfile, initialEmail, dashboardUrl }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Personal Information state
  const [firstName, setFirstName] = useState(initialProfile.first_name);
  const [lastName, setLastName] = useState(initialProfile.last_name);
  const [phone, setPhone] = useState(initialProfile.phone);
  const [username, setUsername] = useState(initialProfile.username);

  // Account Settings state
  const [email, setEmail] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePersonalInfoUpdate = async (e: React.FormEvent) => {
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

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim() || null,
          username: username.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess("Personal information updated successfully");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (email && !email.includes("@")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setError("Password must be at least 6 characters long");
        setIsLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }
    }

    try {
      const updateData: any = {};
      
      if (email !== initialEmail) {
        updateData.email = email;
      }
      
      if (newPassword) {
        updateData.new_password = newPassword;
      }

      if (Object.keys(updateData).length === 0) {
        setError("No changes to save");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update account settings");
      }

      setSuccess("Account settings updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      if (email !== initialEmail) {
        setSuccess("Account settings updated. Please check your email to confirm the new address.");
      }
      
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update account settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="personal">Personal Information</TabsTrigger>
        <TabsTrigger value="account">Account Settings</TabsTrigger>
      </TabsList>

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

      <TabsContent value="personal">
        <Card className="p-6">
          <form onSubmit={handlePersonalInfoUpdate} className="space-y-6">
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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+33 1 23 45 67 89"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Link href={dashboardUrl}>
                <Button type="button" variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                  Back to Dashboard
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="account">
        <Card className="p-6">
          <form onSubmit={handleAccountUpdate} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-sm text-slate-500">
                  If you change your email, you will need to verify the new address.
                </p>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h3 className="font-semibold text-slate-900">Change Password</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    disabled={isLoading}
                  />
                  <p className="text-sm text-slate-500">
                    Password must be at least 6 characters long.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Link href={dashboardUrl}>
                <Button type="button" variant="outline" className="text-red-500 border-red-500 hover:bg-red-50">
                  Back to Dashboard
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Update Account"}
              </Button>
            </div>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

