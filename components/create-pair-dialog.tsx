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
// import { createPair } from "@/lib/pairing";
import { createPair } from "@/app/actions/pair-actions";
import type { Pair } from "@/types";
import { createPairSchema, CreatePairFormData } from "@/lib/validations/pair";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreatePairDialogProps {
  userId: string;
}

export function CreatePairDialog({ userId }: CreatePairDialogProps) {
  // const [displayName, setDisplayName] = useState("");
  // const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [createdPair, setCreatedPair] = useState<Pair | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formStateErrors, isValid },
  } = useForm<CreatePairFormData>({
    resolver: zodResolver(createPairSchema),
    mode: "onChange",
  });

  const onCreatePairSubmit = async (formData: CreatePairFormData) => {
    if (!formData.displayName.trim()) return;
    setLoading(true);

    try {
      const pair = await createPair({
        userId,
        displayName: formData.displayName.trim(),
      });
      setCreatedPair(pair);
      // console.log("formData: ", formData);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (isOpen: boolean) => {
    // If closing after a pair was created, refresh to reflect new state
    if (!isOpen && createdPair) {
      window.location.reload();
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button size="sm">Create Pair</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-40" />
        <DialogContent className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg rounded-lg text-black">
          <DialogTitle className="text-2xl font-bold">
            Create a Pair
          </DialogTitle>
          <DialogDescription className="text-sm">
            Create a pair and share the invite code with your partner.
          </DialogDescription>
          {/* Step 1 — fill in name */}
          {!createdPair && (
            <>
              <div className="flex flex-col gap-2 mt-4">
                <Label htmlFor="display-name" className="text-sm font-normal">
                  Couple Name
                </Label>
                <Input
                  id="display-name"
                  placeholder="e.g. Jake & Maria"
                  {...register("displayName")}
                />
                {formStateErrors && (
                  <p className="text-sm text-red-500">
                    {formStateErrors.displayName?.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <DialogClose asChild>
                  <Button size="sm">Cancel</Button>
                </DialogClose>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white"
                  onClick={handleSubmit(onCreatePairSubmit)}
                  disabled={loading || !isValid}
                >
                  {loading ? "Creating..." : "Create"}
                </Button>
              </div>
            </>
          )}
          {/* Step 2 — show invite code */}
          {createdPair && (
            <>
              <div className="flex flex-col gap-3 mt-2">
                <p className="text-sm text-muted-foreground">
                  Your pair has been created! Share this invite code with your
                  partner:
                </p>
                <div
                  className="flex items-center justify-between bg-accent rounded-md px-4 py-3 cursor-pointer"
                  onClick={() =>
                    navigator.clipboard.writeText(createdPair.invite_code ?? "")
                  }
                >
                  <span className="font-mono font-bold text-lg tracking-widest">
                    {createdPair.invite_code}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Click to copy
                  </span>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white"
                  onClick={() => window.location.reload()}
                >
                  Done
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
