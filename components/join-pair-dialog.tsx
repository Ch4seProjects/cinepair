"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogPortal,
  DialogOverlay,
} from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { joinPair } from "@/lib/pairing";
import { joinPair } from "@/app/actions/pair-actions";
import { JoinPairFormData, joinPairSchema } from "@/lib/validations/pair";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface JoinPairDialogProps {
  userId: string;
}

export function JoinPairDialog({ userId }: JoinPairDialogProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formStateErrors, isValid },
  } = useForm<JoinPairFormData>({
    resolver: zodResolver(joinPairSchema),
    mode: "onChange",
  });

  const onJoinPairSubmit = async (formData: JoinPairFormData) => {
    if (!formData.inviteCode.trim()) return;
    setLoading(true);

    const result = await joinPair({ userId, inviteCode: formData.inviteCode });

    if (!result.success) {
      toast.error(result.error.message);
      setLoading(false);
      return;
    }

    setOpen(false);
    setLoading(false);
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Join Pair</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-background/50 z-40" />
        <DialogContent className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-card-foreground text-card-foreground p-6 shadow-lg rounded-lg">
          <DialogTitle className="text-2xl font-bold text-background">
            Join a Pair
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Enter the invite code shared by your partner.
          </DialogDescription>
          <div className="flex flex-col gap-2 mt-4">
            <Label
              htmlFor="code"
              className="text-sm font-normal text-background"
            >
              Invite Code
            </Label>
            <Input
              id="code"
              placeholder="e.g. AB12CD34"
              className="text-background"
              {...register("inviteCode")}
            />
            {formStateErrors && (
              <p className="text-sm text-destructive">
                {formStateErrors.inviteCode?.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button size="sm">Cancel</Button>
            </DialogClose>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSubmit(onJoinPairSubmit)}
              disabled={loading || !isValid}
            >
              {loading ? "Joining..." : "Join"}
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
