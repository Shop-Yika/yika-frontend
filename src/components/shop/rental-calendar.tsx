'use client';

import { addMonths, eachDayOfInterval, endOfMonth, format, getDay, startOfMonth } from 'date-fns';

// What a single day on the calendar can be.
// Past and booked days both count as 'unavailable', as on the rental site.
export type DayState = 'unavailable' | 'available' | 'rental' | 'buffer';

// Colours and states are the rental site's (rent.shopyika.com).
const DAY_STYLES: Record<DayState, string> = {
    unavailable: 'bg-[#eee6ec] text-[#c9bcc6] line-through decoration-1 cursor-not-allowed',
    available:   'bg-[#FCF2F8] text-[#2a1f2b] cursor-pointer hover:bg-[#EAEFC5]',
    rental:      'bg-[#B5C63C] text-[#2f3a12] font-bold cursor-pointer',
    buffer:      'bg-[#EAEFC5] text-[#6f7a3a] font-semibold cursor-pointer',
};

const LEGEND: { label: string; swatch: string }[] = [
    { label: 'Rental days',     swatch: 'bg-[#B5C63C]' },
    { label: 'Buffer (2 days)', swatch: 'bg-[#EAEFC5] border border-[#C7D45E]' },
    { label: 'Available',       swatch: 'bg-[#FCF2F8] border border-[#ecdde8]' },
    { label: 'Unavailable',     swatch: 'bg-[#eee6ec]' },
];

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface MonthGridProps {
    month: Date;
    getDayState: (date: Date) => DayState;
    onDayClick: (date: Date) => void;
}

// One month: a title, the weekday letters, and a square for each day.
function MonthGrid({ month, getDayState, onDayClick }: MonthGridProps) {
    const firstDay = startOfMonth(month);
    const days = eachDayOfInterval({ start: firstDay, end: endOfMonth(month) });
    const blanks = getDay(firstDay); // empty squares before day 1

    return (
        <div className="min-w-0">
            <p className="text-[13px] font-bold text-[#2a1f2b] text-center mb-1.5">
                {format(month, 'MMMM yyyy')}
            </p>
            <div className="grid grid-cols-7 gap-0.5">
                {WEEKDAYS.map((letter, i) => (
                    <span key={i} className="text-[9.5px] uppercase text-[#9a8b98] text-center pb-[3px]">
                        {letter}
                    </span>
                ))}
                {Array.from({ length: blanks }).map((_, i) => (
                    <span key={`blank-${i}`} />
                ))}
                {days.map((day) => {
                    const state = getDayState(day);
                    return (
                        <button
                            key={day.toISOString()}
                            type="button"
                            disabled={state === 'unavailable'}
                            onClick={() => onDayClick(day)}
                            className={`aspect-square rounded-lg text-xs flex items-center justify-center ${DAY_STYLES[state]}`}
                        >
                            {format(day, 'd')}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

interface RentalCalendarProps {
    month: Date;                              // the first of the two months shown
    onMonthChange: (month: Date) => void;
    getDayState: (date: Date) => DayState;
    onDayClick: (date: Date) => void;
    canGoEarlier?: boolean;                   // false greys out the ‹ arrow
    canGoLater?: boolean;                     // false greys out the › arrow
    emptyMessage?: string;                    // shown in place of the months when there are no windows
}

const ARROW_CLASS =
    'w-[30px] h-[30px] rounded-[9px] bg-white border border-[#ecdde8] text-base leading-none text-[#662762] ' +
    'cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed disabled:text-[#9a8b98]';

// Two months side by side, with arrows to move and a colour legend.
export function RentalCalendar({
    month,
    onMonthChange,
    getDayState,
    onDayClick,
    canGoEarlier = true,
    canGoLater = true,
    emptyMessage,
}: RentalCalendarProps) {
    return (
        <div>
            {emptyMessage ? (
                <div className="text-[13.5px] text-[#5c4f5c] bg-[#FCF2F8] border border-[#ecdde8] rounded-xl p-4 text-center">
                    {emptyMessage}
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-2.5">
                        <button
                            type="button"
                            disabled={!canGoEarlier}
                            onClick={() => onMonthChange(addMonths(month, -1))}
                            className={ARROW_CLASS}
                            aria-label="Earlier months"
                        >
                            ‹
                        </button>
                        <button
                            type="button"
                            disabled={!canGoLater}
                            onClick={() => onMonthChange(addMonths(month, 1))}
                            className={ARROW_CLASS}
                            aria-label="Later months"
                        >
                            ›
                        </button>
                    </div>

                    <div className="grid grid-cols-1 min-[861px]:grid-cols-2 gap-[18px]">
                        <MonthGrid month={month} getDayState={getDayState} onDayClick={onDayClick} />
                        <MonthGrid month={addMonths(month, 1)} getDayState={getDayState} onDayClick={onDayClick} />
                    </div>
                </>
            )}

            <div className="flex flex-wrap gap-3 mt-3 text-[11px] text-[#9a8b98]">
                {LEGEND.map((item) => (
                    <span key={item.label} className="flex items-center">
                        <span className={`w-[11px] h-[11px] rounded-[3px] mr-[5px] ${item.swatch}`} />
                        {item.label}
                    </span>
                ))}
            </div>
        </div>
    );
}