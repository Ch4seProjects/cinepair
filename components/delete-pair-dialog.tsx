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
import { deletePair } from "@/app/actions/pair-actions";
import { toast } from "sonner";

export function DeletePairDialog() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onJoinPairSubmit = async () => {
    const result = await deletePair();

    if (!result.success) {
      toast.error(result.error.message);
      setLoading(false);
      return;
    }

    toast.success("Pair deleted successfully.");
    setOpen(false);
    setLoading(false);
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Delete</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-background/50 z-40" />
        <DialogContent className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-card-foreground text-card-foreground p-6 shadow-lg rounded-lg">
          <DialogTitle className="text-2xl font-bold text-background">
            Delete Pair
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to delete your pair?
          </DialogDescription>
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button size="sm">Cancel</Button>
            </DialogClose>
            <Button
              size="sm"
              variant="outline"
              onClick={onJoinPairSubmit}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
