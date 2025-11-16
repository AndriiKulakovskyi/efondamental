"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertBanner } from "@/components/ui/alert-banner";
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Loader2,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VisitActionsProps {
  visitId: string;
  patientId: string;
  pathology: string;
  status: string;
  completionStatus: {
    totalQuestionnaires: number;
    completedQuestionnaires: number;
    completionPercentage: number;
  };
}

export default function VisitActions({
  visitId,
  patientId,
  pathology,
  status,
  completionStatus,
}: VisitActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");

  const handleAction = async (action: string, additionalData?: any) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/professional/visits/${visitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          ...additionalData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} visit`);
      }

      router.refresh();
      
      if (action === "complete") {
        router.push(`/professional/${pathology}/patients/${patientId}`);
      }
      
      setShowRescheduleDialog(false);
      setShowCancelDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartVisit = () => {
    handleAction("start");
  };

  const handleCompleteVisit = () => {
    if (completionStatus.completedQuestionnaires < completionStatus.totalQuestionnaires) {
      setError(
        `Cannot complete visit. ${completionStatus.totalQuestionnaires - completionStatus.completedQuestionnaires} questionnaires remaining.`
      );
      return;
    }
    handleAction("complete");
  };

  const handleReschedule = () => {
    if (!rescheduleDate) {
      setError("Please select a new date");
      return;
    }
    handleAction("reschedule", { scheduledDate: rescheduleDate });
  };

  const handleCancel = () => {
    handleAction("cancel");
  };

  return (
    <>
      <div className="flex gap-2">
        {status === "scheduled" && (
          <>
            <Button onClick={handleStartVisit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Visit
                </>
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowRescheduleDialog(true)}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Reschedule
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowCancelDialog(true)}
                  className="text-red-600"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Visit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}

        {status === "in_progress" && (
          <>
            <Button onClick={handleCompleteVisit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete Visit
                </>
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => setShowCancelDialog(true)}
                  className="text-red-600"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Visit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}

        {status === "completed" && (
          <div className="text-sm text-slate-600 flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
            Visit Completed
          </div>
        )}

        {status === "cancelled" && (
          <div className="text-sm text-slate-600 flex items-center">
            <XCircle className="mr-2 h-5 w-5 text-red-600" />
            Visit Cancelled
          </div>
        )}
      </div>

      {error && (
        <div className="absolute top-20 right-4 max-w-md">
          <AlertBanner type="error" message={error} />
        </div>
      )}

      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Visit</DialogTitle>
            <DialogDescription>
              Select a new date and time for this visit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reschedule-date">New Date & Time</Label>
              <Input
                id="reschedule-date"
                type="datetime-local"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
              />
            </div>
            {error && <AlertBanner type="error" message={error} />}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRescheduleDialog(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleReschedule} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rescheduling...
                </>
              ) : (
                "Reschedule"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Visit</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this visit? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {error && <AlertBanner type="error" message={error} />}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={isLoading}
            >
              Keep Visit
            </Button>
            <Button 
              variant="destructive"
              onClick={handleCancel} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Visit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

