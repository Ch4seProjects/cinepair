"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPair } from "@/lib/pairing";
import type { Pair } from "@/types";

interface CreatePairDialogProps {
  userId: string;
}

export function CreatePairDialog({ userId }: CreatePairDialogProps) {
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [createdPair, setCreatedPair] = useState<Pair | null>(null);

  const handleCreate = async () => {
    if (!displayName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const pair = await createPair({
        userId,
        displayName: displayName.trim(),
      });
      setCreatedPair(pair);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
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
      <DialogContent>
        <DialogTitle>Create a Pair</DialogTitle>
        <DialogDescription>
          Create a pair and share the invite code with your partner.
        </DialogDescription>

        {/* Step 1 — fill in name */}
        {!createdPair && (
          <>
            <div className="flex flex-col gap-3 mt-2">
              <Label htmlFor="display-name">Couple Name</Label>
              <Input
                id="display-name"
                placeholder="e.g. Jake & Maria"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                size="sm"
                onClick={handleCreate}
                disabled={loading || !displayName.trim()}
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
              <Button size="sm" onClick={() => window.location.reload()}>
                Done
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
