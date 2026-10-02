"use client"

/**
 * calendar.tsx  (shadcn/ui — react-day-picker v9)
 *
 * Modified from the default shadcn scaffold to bake in the project's purple
 * design tokens directly on the DayButton data-attribute selectors.
 *
 * Changes from default:
 *  - data-[selected-single=true]: purple bg (#9B5DE5) + white text
 *  - data-[today=true]:           light purple tint bg (#F3EEFF) + purple text
 *  - Hover:                       light purple tint (#F3EEFF)
 *  - Dark-mode overrides removed  (this project is light-mode only)
 *
 * Everything else (nav layout, multi-month absolute positioning, weekday
 * headers, outside/disabled states) is unchanged from the shadcn default so
 * that numberOfMonths={2} continues to work with ‹ on the far left and › on
 * the far right.
 */

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
} from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
                    className,
                    classNames,
                    showOutsideDays = true,
                    captionLayout = "label",
                    buttonVariant = "ghost",
                    formatters,
                    components,
                    ...props
                  }: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
      <DayPicker
          showOutsideDays={showOutsideDays}
          className={cn(
              "group/calendar bg-background p-3 [--cell-size:--spacing(8)]",
              "[[data-slot=card-content]_&]:bg-transparent",
              "[[data-slot=popover-content]_&]:bg-transparent",
              String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
              String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
              className
          )}
          captionLayout={captionLayout}
          formatters={{
            formatMonthDropdown: (date) =>
                date.toLocaleString("default", { month: "short" }),
            ...formatters,
          }}
          classNames={{
            root: cn("w-fit", defaultClassNames.root),
            months: cn(
                "relative flex flex-col gap-4 md:flex-row",
                defaultClassNames.months
            ),
            month: cn("flex w-full flex-col gap-4", defaultClassNames.month),

            /*
             * nav: absolutely positioned bar spanning all months.
             * This is what gives us ‹ on the far left and › on the far right
             * when numberOfMonths={2}. Do not change the positioning classes.
             */
            nav: cn(
                "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
                defaultClassNames.nav
            ),

            /*
             * Nav arrow buttons — styled with our purple hover colours.
             */
            button_previous: cn(
                buttonVariants({ variant: buttonVariant }),
                "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
                "hover:bg-[#F3EEFF] hover:text-[#9B5DE5]",
                defaultClassNames.button_previous
            ),
            button_next: cn(
                buttonVariants({ variant: buttonVariant }),
                "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
                "hover:bg-[#F3EEFF] hover:text-[#9B5DE5]",
                defaultClassNames.button_next
            ),

            /*
             * Month caption row — holds the month/year label, centred.
             * Horizontally padded so the text doesn't sit under the arrows.
             */
            month_caption: cn(
                "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
                defaultClassNames.month_caption
            ),
            caption_label: cn(
                "text-sm font-semibold text-[#1A1530] select-none",
                defaultClassNames.caption_label
            ),

            dropdowns: cn(
                "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
                defaultClassNames.dropdowns
            ),
            dropdown_root: cn(
                "relative rounded-md border border-input shadow-xs has-focus:border-ring has-focus:ring-[3px] has-focus:ring-ring/50",
                defaultClassNames.dropdown_root
            ),
            dropdown: cn(
                "absolute inset-0 bg-popover opacity-0",
                defaultClassNames.dropdown
            ),

            table: "w-full border-collapse",

            /*
             * Weekday header row: Su Mo Tu We Th Fr Sa
             */
            weekdays: cn("flex", defaultClassNames.weekdays),
            weekday: cn(
                "flex-1 rounded-md text-[0.75rem] font-semibold text-[#8A85A0] select-none",
                defaultClassNames.weekday
            ),

            week: cn("mt-2 flex w-full", defaultClassNames.week),
            week_number_header: cn(
                "w-(--cell-size) select-none",
                defaultClassNames.week_number_header
            ),
            week_number: cn(
                "text-[0.8rem] text-muted-foreground select-none",
                defaultClassNames.week_number
            ),

            /*
             * day: the cell wrapper. Preserves the aspect-square sizing and
             * the range-selection rounded corners from the default.
             */
            day: cn(
                "group/day relative aspect-square h-full w-full p-0 text-center select-none",
                "[&:last-child[data-selected=true]_button]:rounded-r-md",
                props.showWeekNumber
                    ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-md"
                    : "[&:first-child[data-selected=true]_button]:rounded-l-md",
                defaultClassNames.day
            ),

            /*
             * State classes — cleared so DayButton's data-attribute selectors
             * below have full control without specificity fights.
             */
            today: cn(
                "rounded-md bg-[#F3EEFF] text-[#9B5DE5]",
                defaultClassNames.today
            ),
            outside: cn(
                "text-[#C4BFD4] opacity-50 aria-selected:text-[#C4BFD4]",
                defaultClassNames.outside
            ),
            disabled: cn(
                "text-[#D4D0DF] opacity-40",
                defaultClassNames.disabled
            ),
            hidden: cn("invisible", defaultClassNames.hidden),

            // Merge any additional classNames passed by the consumer
            ...classNames,
          }}
          components={{
            Root: ({ className, rootRef, ...props }) => (
                <div
                    data-slot="calendar"
                    ref={rootRef}
                    className={cn(className)}
                    {...props}
                />
            ),
            Chevron: ({ className, orientation, ...props }) => {
              if (orientation === "left")
                return <ChevronLeftIcon className={cn("size-4", className)} {...props} />
              if (orientation === "right")
                return <ChevronRightIcon className={cn("size-4", className)} {...props} />
              return <ChevronDownIcon className={cn("size-4", className)} {...props} />
            },
            DayButton: CalendarDayButton,
            WeekNumber: ({ children, ...props }) => (
                <td {...props}>
                  <div className="flex size-(--cell-size) items-center justify-center text-center">
                    {children}
                  </div>
                </td>
            ),
            ...components,
          }}
          {...props}
      />
  )
}

/**
 * CalendarDayButton
 *
 * The clickable button rendered inside each day cell.
 *
 * Colour behaviour (via Tailwind data-attribute selectors):
 *  data-selected-single=true → solid purple fill (#9B5DE5), white text
 *  data-today=true (via parent .today class) → handled at cell level above
 *  hover (unselected)        → light purple tint (#F3EEFF)
 *  disabled                  → muted grey, no pointer events
 */
function CalendarDayButton({
                             className,
                             day,
                             modifiers,
                             ...props
                           }: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
      <Button
          ref={ref}
          variant="ghost"
          size="icon"
          data-day={day.date.toLocaleDateString()}
          data-selected-single={
              modifiers.selected &&
              !modifiers.range_start &&
              !modifiers.range_end &&
              !modifiers.range_middle
          }
          data-range-start={modifiers.range_start}
          data-range-end={modifiers.range_end}
          data-range-middle={modifiers.range_middle}
          className={cn(
              // Base sizing + layout
              "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal",
              // Focus ring
              "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10",
              "group-data-[focused=true]/day:border-[#9B5DE5] group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-[#9B5DE5]/30",
              // Hover — light purple tint
              "hover:bg-[#F3EEFF] hover:text-[#9B5DE5]",
              // ── Selected single date: solid purple ──
              "data-[selected-single=true]:bg-[#9B5DE5] data-[selected-single=true]:text-white data-[selected-single=true]:font-semibold",
              "data-[selected-single=true]:hover:bg-[#7C3ACA]",
              // Range start/middle/end: same solid purple, same rounding
              "data-[range-start=true]:rounded-md data-[range-start=true]:bg-[#9B5DE5] data-[range-start=true]:text-white",
              "data-[range-end=true]:rounded-md data-[range-end=true]:bg-[#9B5DE5] data-[range-end=true]:text-white",
              "data-[range-middle=true]:rounded-md data-[range-middle=true]:bg-[#9B5DE5] data-[range-middle=true]:text-white",
              // Sub-event spans (e.g. event dots)
              "[&>span]:text-xs [&>span]:opacity-70",
              defaultClassNames.day,
              className
          )}
          {...props}
      />
  )
}

export { Calendar, CalendarDayButton }