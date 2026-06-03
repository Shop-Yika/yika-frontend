"use client";

/**
 * PhotoUploadSlot — single labeled photo-upload square.
 *
 * Used by the merchant "Post a Listing" page (issue B9). Renders a
 * dashed-border square with a camera icon + label until a file is
 * picked, then swaps to a preview thumbnail with a remove (×) button.
 *
 * The file is held in parent state — no upload happens here.
 *
 * Design tokens (Tailwind semantic classes from `globals.css`):
 *   - bg-surface          card background
 *   - border-border-default / border-text-faint  default border
 *   - text-text-muted     label color
 *   - hover:border-brand-magenta + hover:bg-status-magenta-bg
 *     for the dashed slot
 */

import { useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PhotoUploadSlotProps = {
    /** Short label rendered under the camera icon (e.g. "Cover"). */
    label: string;
    /** Data URL of the previewed image, if a file has been picked. */
    preview?: string;
    /** Called when the user picks a file. */
    onChange: (file: File) => void;
    /** Called when the user removes a previously-picked file. */
    onRemove: () => void;
};

export function PhotoUploadSlot({
    label,
    preview,
    onChange,
    onRemove,
}: PhotoUploadSlotProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const openPicker = () => inputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onChange(file);
        // Reset so picking the same file twice still fires onChange.
        e.target.value = '';
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove();
    };

    return (
        <div className="flex flex-col items-center">
            <button
                type="button"
                onClick={openPicker}
                aria-label={preview ? `Change ${label} photo` : `Upload ${label} photo`}
                className={cn(
                    'group relative w-full aspect-square rounded-xl overflow-hidden',
                    'flex items-center justify-center transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-magenta/40',
                    preview
                        ? 'border border-border-default'
                        : 'border border-dashed border-border-default bg-surface hover:border-brand-magenta hover:bg-status-magenta-bg',
                )}
            >
                {preview ? (
                    <>
                        {/* Preview thumbnail. Plain <img> intentionally — these
                            are local data URLs (no Next/Image optimization). */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={preview}
                            alt={label}
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            aria-label={`Remove ${label} photo`}
                            className="absolute top-1.5 right-1.5 grid place-items-center w-6 h-6 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-1.5">
                        <Camera className="w-5 h-5 text-text-faint" />
                        <span className="text-[11px] font-medium text-text-muted">
                            {label}
                        </span>
                    </div>
                )}
            </button>
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}

export default PhotoUploadSlot;
