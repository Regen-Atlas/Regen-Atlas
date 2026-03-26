import clsx from "clsx";
import { CalendarBlank, X, Play, Pause } from "@phosphor-icons/react";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Action } from "../../shared/types";

interface TimeSliderProps {
  actions: Action[];
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

const formatDateLabel = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const dateToMonthIndex = (date: Date): number => {
  return date.getFullYear() * 12 + date.getMonth();
};

const monthIndexToDate = (monthIndex: number): Date => {
  const year = Math.floor(monthIndex / 12);
  const month = monthIndex % 12;
  return new Date(year, month, 1);
};

export const TimeSlider = ({
  actions,
  selectedDate,
  onDateChange,
}: TimeSliderProps): JSX.Element => {
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { minDate, maxDate } = useMemo(() => {
    let min: Date | null = null;

    for (const action of actions) {
      if (action.action_start_date) {
        const startDate = new Date(action.action_start_date);
        if (!min || startDate < min) min = startDate;
      }
    }

    return {
      minDate: min || new Date(2020, 0, 1),
      maxDate: new Date(),
    };
  }, [actions]);

  const minMonths = dateToMonthIndex(minDate);
  const maxMonths = dateToMonthIndex(maxDate);
  const sliderValue = selectedDate
    ? dateToMonthIndex(selectedDate)
    : maxMonths;

  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startPlayback = useCallback(() => {
    onDateChange(monthIndexToDate(minMonths));
    setIsPlaying(true);
  }, [minMonths, onDateChange]);

  const togglePlayback = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  useEffect(() => {
    if (!isPlaying) return;

    intervalRef.current = setInterval(() => {
      const currentIndex = selectedDate
        ? dateToMonthIndex(selectedDate)
        : minMonths;
      const nextIndex = currentIndex + 1;

      if (nextIndex > maxMonths) {
        stopPlayback();
        onDateChange(null);
      } else {
        onDateChange(monthIndexToDate(nextIndex));
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, selectedDate, minMonths, maxMonths, onDateChange, stopPlayback]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPlaying) stopPlayback();
    const monthIndex = parseInt(e.target.value, 10);
    onDateChange(monthIndexToDate(monthIndex));
  };

  const handleClear = () => {
    if (isPlaying) stopPlayback();
    onDateChange(null);
  };

  return (
    <div
      className={clsx(
        "bg-cardBackground/95 backdrop-blur-sm rounded-2xl p-4 md:p-5",
        "border border-white",
        "w-full md:w-[400px] lg:w-[500px]"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-blue-950 font-medium">
          <CalendarBlank size={20} weight="bold" />
          <span className="text-sm md:text-base">Time Filter</span>
        </div>
        {selectedDate ? (
          <div className="flex items-center gap-2">
            <span className="text-sm md:text-base font-bold text-blue-950">
              {formatDateLabel(selectedDate)}
            </span>
            <button
              onClick={handleClear}
              className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-300 hover:bg-red-500 hover:text-white transition-colors"
              title="Clear date filter"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <span className="text-sm md:text-base font-bold text-gray-500">All dates</span>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={togglePlayback}
          className={clsx(
            "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
            isPlaying
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          )}
          title={isPlaying ? "Pause playback" : "Play timeline (1 sec/month)"}
        >
          {isPlaying ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
        </button>

        <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap min-w-[70px]">
          {formatDateLabel(minDate)}
        </span>

        <div className="flex-1 flex items-center relative h-8 ">
          <input
            type="range"
            min={minMonths}
            max={maxMonths}
            value={sliderValue}
            onChange={handleSliderChange}
            className={clsx(
              "w-full cursor-pointer",
              selectedDate ? "time-slider-point" : "time-slider-all-dates"
            )}
            aria-label={
              selectedDate ? "Select month to display" : "All dates displayed"
            }
          />
          <span className="text-[10px] text-gray-500 mt-1 text-center absolute -bottom-2 left-0 right-0">
            {selectedDate
              ? "Showing selected month only"
              : "Showing all dates"}
          </span>
        </div>

        <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap min-w-[70px] text-right">
          {formatDateLabel(maxDate)}
        </span>
      </div>
    </div>
  );
};
