"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  Mail, 
  Clock, 
  XCircle, 
  Send,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { AlertBanner } from "@/components/ui/alert-banner";

interface InvitationStatusProps {
  patientId: string;
  patientEmail: string | null;
  hasUserAccount: boolean;
  pendingInvitation: {
    id: string;
    sentAt: string;
    expiresAt: string;
  } | null;
}

export function InvitationStatus({
  patientId,
  patientEmail,
  hasUserAccount,
  pendingInvitation,
}: InvitationStatusProps) {
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSendInvitation = async () => {
    setError(null);
    setSuccess(null);
    setIsSending(true);

    try {
      const response = await fetch(`/api/professional/patients/${patientId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitation");
      }

      setSuccess("Invitation sent successfully!");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invitation");
    } finally {
      setIsSending(false);
    }
  };

  const handleResendInvitation = async () => {
    if (!pendingInvitation) return;
    
    setError(null);
    setSuccess(null);
    setIsSending(true);

    try {
      const response = await fetch(`/api/professional/patients/${patientId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resend: true }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend invitation");
      }

      setSuccess("Invitation resent successfully!");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend invitation");
    } finally {
      setIsSending(false);
    }
  };

  // Determine status
  const getStatus = () => {
    if (hasUserAccount) {
      return {
        badge: (
          <Badge className="bg-green-100 text-green-800 border-green-200 border">
            <CheckCircle className="h-3 w-3 mr-1" />
            Account Active
          </Badge>
        ),
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        message: "Patient has an active account and can access the portal",
        action: null,
      };
    }

    if (pendingInvitation) {
      const isExpired = new Date(pendingInvitation.expiresAt) < new Date();
      
      if (isExpired) {
        return {
          badge: (
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 border">
              <XCircle className="h-3 w-3 mr-1" />
              Invitation Expired
            </Badge>
          ),
          icon: <XCircle className="h-5 w-5 text-amber-600" />,
          message: `Invitation expired on ${new Date(pendingInvitation.expiresAt).toLocaleDateString()}`,
          action: (
            <Button
              size="sm"
              onClick={handleResendInvitation}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Resend Invitation
                </>
              )}
            </Button>
          ),
        };
      }

      return {
        badge: (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 border">
            <Clock className="h-3 w-3 mr-1" />
            Invitation Pending
          </Badge>
        ),
        icon: <Clock className="h-5 w-5 text-blue-600" />,
        message: `Invitation sent on ${new Date(pendingInvitation.sentAt).toLocaleDateString()}. Expires on ${new Date(pendingInvitation.expiresAt).toLocaleDateString()}`,
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={handleResendInvitation}
            disabled={isSending}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Resend Invitation
              </>
            )}
          </Button>
        ),
      };
    }

    if (!patientEmail) {
      return {
        badge: (
          <Badge className="bg-slate-100 text-slate-700 border-slate-200 border">
            <Mail className="h-3 w-3 mr-1" />
            No Email
          </Badge>
        ),
        icon: <AlertTriangle className="h-5 w-5 text-slate-500" />,
        message: "No email address provided. Patient cannot access the portal.",
        action: null,
      };
    }

    return {
      badge: (
        <Badge className="bg-slate-100 text-slate-700 border-slate-200 border">
          <Mail className="h-3 w-3 mr-1" />
          No Invitation
        </Badge>
      ),
      icon: <Mail className="h-5 w-5 text-slate-600" />,
      message: "Email provided but invitation not sent yet",
      action: (
        <Button
          size="sm"
          onClick={handleSendInvitation}
          disabled={isSending}
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Invitation
            </>
          )}
        </Button>
      ),
    };
  };

  const status = getStatus();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Patient Portal Access</CardTitle>
          {status.badge}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {status.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-600 mb-3">{status.message}</p>
            {patientEmail && (
              <p className="text-xs text-slate-500 mb-3">
                Email: <span className="font-medium">{patientEmail}</span>
              </p>
            )}
            {error && <AlertBanner type="error" message={error} />}
            {success && <AlertBanner type="success" message={success} />}
            {status.action && <div className="mt-3">{status.action}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

