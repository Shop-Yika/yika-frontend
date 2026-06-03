"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { notifications as notificationsRepo } from "@/lib/data/repositories";
import type { Notification } from "@/lib/data/types";
import { NotificationItem } from "./NotificationItem";

export type NotificationsDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Slide-in panel that lists notifications for the signed-in user.
 *
 * Loads notifications via `notifications.list()` each time the drawer opens
 * (no polling, no websockets — see A5 issue "Out of scope"). When an item
 * is clicked, marks it read via `notifications.markRead(id)` and updates
 * local state optimistically so the magenta unread dot disappears.
 *
 * Wraps the shadcn Sheet primitive (from issue A3).
 */
export function NotificationsDrawer({
  open,
  onOpenChange,
}: NotificationsDrawerProps) {
  const [items, setItems] = useState<Notification[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Fetch fresh notifications each time the drawer is opened.
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    notificationsRepo.list().then((fetched) => {
      if (cancelled) return;
      setItems(fetched);
      setHasLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const loading = !hasLoaded;

  const handleItemClick = (id: string) => {
    // Optimistically mark read in local state; fire-and-forget the repo call.
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    void notificationsRepo.markRead(id);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full bg-surface p-0 sm:max-w-[400px]"
      >
        <SheetHeader className="border-border-default border-b px-4 py-4">
          <SheetTitle className="text-text-primary text-lg font-semibold">
            Notifications
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {loading && items.length === 0 ? (
            <p className="px-4 py-6 text-sm text-text-muted">
              Loading notifications…
            </p>
          ) : items.length === 0 ? (
            <p className="px-4 py-6 text-sm text-text-muted">
              You&apos;re all caught up.
            </p>
          ) : (
            <ul className="divide-border-subtle divide-y">
              {items.map((item) => (
                <li key={item.id}>
                  <NotificationItem
                    notification={item}
                    onClick={handleItemClick}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
