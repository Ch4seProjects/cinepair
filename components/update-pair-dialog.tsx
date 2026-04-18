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
import { updatePair } from "@/app/actions/pair-actions";
import { updatePairSchema, UpdatePairFormData } from "@/lib/validations/pair";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface UpdatePairDialogProps {
  prevName: string | null;
}

export function UpdatePairDialog({ prevName }: UpdatePairDialogProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formStateErrors, isValid },
  } = useForm<UpdatePairFormData>({
    resolver: zodResolver(updatePairSchema),
    mode: "onChange",
  });

  const onUpdatePairSubmit = async (formData: UpdatePairFormData) => {
    if (!formData.name.trim()) return;
    if (formData.name.trim() === prevName) {
      toast.info("No changes to save.");
      return;
    }
    setLoading(true);

    const result = await updatePair({ name: formData.name });

    if (!result.success) {
      toast.error(result.error.message);
      setLoading(false);
      return;
    }

    toast.success(result.message);
    setOpen(false);
    setLoading(false);
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Update</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-background/50 z-40" />
        <DialogContent className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-card-foreground text-card-foreground p-6 shadow-lg rounded-lg">
          <DialogTitle className="text-2xl font-bold text-background">
            Update Pair
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update the name of your pair.
          </DialogDescription>
          <div className="flex flex-col gap-2 mt-4">
            <Label
              htmlFor="code"
              className="text-sm font-normal text-background"
            >
              Name
            </Label>
            <Input
              id="code"
              placeholder="Pair Name"
              className="text-background"
              defaultValue={prevName ?? ""}
              {...register("name")}
            />
            {formStateErrors && (
              <p className="text-sm text-destructive">
                {formStateErrors.name?.message}
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
              onClick={handleSubmit(onUpdatePairSubmit)}
              disabled={loading || !isValid}
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
