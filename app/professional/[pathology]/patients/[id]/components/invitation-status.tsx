"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        throw new Error(data.error || "Échec de l'envoi de l'invitation");
      }

      setSuccess("Invitation envoyée avec succès!");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'envoi de l'invitation");
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
        throw new Error(data.error || "Échec du renvoi de l'invitation");
      }

      setSuccess("Invitation renvoyée avec succès!");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec du renvoi de l'invitation");
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
            Compte actif
          </Badge>
        ),
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        message: "Le patient a un compte actif et peut accéder au portail",
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
              Invitation expirée
            </Badge>
          ),
          icon: <XCircle className="h-5 w-5 text-amber-600" />,
          message: `Invitation expirée le ${new Date(pendingInvitation.expiresAt).toLocaleDateString('fr-FR')}`,
          action: (
            <Button
              size="sm"
              onClick={handleResendInvitation}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Renvoyer l'invitation
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
            Invitation en attente
          </Badge>
        ),
        icon: <Clock className="h-5 w-5 text-blue-600" />,
        message: `Invitation envoyée le ${new Date(pendingInvitation.sentAt).toLocaleDateString('fr-FR')}. Expire le ${new Date(pendingInvitation.expiresAt).toLocaleDateString('fr-FR')}`,
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
                Envoi...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Renvoyer l'invitation
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
            Aucun email
          </Badge>
        ),
        icon: <AlertTriangle className="h-5 w-5 text-slate-500" />,
        message: "Aucune adresse email fournie. Le patient ne peut pas accéder au portail.",
        action: null,
      };
    }

    return {
      badge: (
        <Badge className="bg-slate-100 text-slate-700 border-slate-200 border">
          <Mail className="h-3 w-3 mr-1" />
          Aucune invitation
        </Badge>
      ),
      icon: <Mail className="h-5 w-5 text-slate-600" />,
      message: "Email fourni mais invitation non envoyée",
      action: (
        <Button
          size="sm"
          onClick={handleSendInvitation}
          disabled={isSending}
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Envoyer l'invitation
            </>
          )}
        </Button>
      ),
    };
  };

  const status = getStatus();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Accès au portail patient</h3>
        {status.badge}
      </div>
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
    </div>
  );
}
