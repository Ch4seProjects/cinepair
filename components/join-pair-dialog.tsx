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
import { joinPair } from "@/lib/pairing";

interface JoinPairDialogProps {
  userId: string;
}

export function JoinPairDialog({ userId }: JoinPairDialogProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleJoin = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await joinPair({ userId, inviteCode: code });
      setOpen(false);
      window.location.reload(); // refresh server component
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Join Pair</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Join a Pair</DialogTitle>
        <DialogDescription>
          Enter the invite code shared by your partner.
        </DialogDescription>
        <div className="flex flex-col gap-3 mt-2">
          <Label htmlFor="code">Invite Code</Label>
          <Input
            id="code"
            placeholder="e.g. AB12CD34"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
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
            onClick={handleJoin}
            disabled={loading || !code.trim()}
          >
            {loading ? "Joining..." : "Join"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
