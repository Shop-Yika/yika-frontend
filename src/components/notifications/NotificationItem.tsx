"use client";

import Image from "next/image";
import type { Notification } from "@/lib/data/types";

type NotificationItemProps = {
  notification: Notification;
  onClick?: (id: string) => void;
};

/**
 * Single notification row in the NotificationsDrawer.
 *
 * Layout (matches `docs/dashboard/figma/4449-1786-notifications-drawer.png`):
 *   - Round Yika logo avatar on the left
 *   - Title ("Yika") + body text, with a right-aligned timestamp
 *   - Unread items show a small magenta dot on the far right
 */
export function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const { id, title, body, timestamp, read } = notification;

  return (
    <button
      type="button"
      onClick={() => onClick?.(id)}
      className="flex w-full items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-border-subtle focus:outline-none focus-visible:bg-border-subtle"
    >
      {/* Yika avatar */}
      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-status-magenta-bg">
        <Image
          src="/assets/logos/Logo-Mark.svg"
          alt="Yika"
          fill
          sizes="40px"
          className="object-contain p-2"
        />
      </div>

      {/* Body */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-text-primary">
            {title}
          </span>
          <span className="flex-shrink-0 text-xs text-text-faint">
            {timestamp}
          </span>
        </div>
        <p className="text-sm leading-snug text-text-muted">{body}</p>
      </div>

      {/* Unread dot */}
      <div className="flex h-5 flex-shrink-0 items-center self-start pt-1.5">
        {!read && (
          <span
            aria-label="Unread"
            className="block h-2 w-2 rounded-full bg-brand-magenta"
          />
        )}
      </div>
    </button>
  );
}
