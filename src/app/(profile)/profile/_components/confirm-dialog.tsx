"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { ReactNode } from "react";

export default function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "تأیید",
  onConfirm,
  pending,
  destructive = true,
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<unknown>;
  pending?: boolean;
  destructive?: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="leading-6">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={pending}>
              انصراف
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant={destructive ? "destructive" : "default"}
              disabled={pending}
              onClick={() => {
                void Promise.resolve(onConfirm()).catch(() => undefined);
              }}
            >
              {pending ? "در حال انجام..." : confirmLabel}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
