import { useState, useMemo } from "react";
import { useQuery } from "react-query";
import { Timetable, TimetableEntry } from "../../../../database/interfaces";
import { getTimetable } from "../../../../database/pocketbase";
import LoadingSpinner from "../../../../components/loading-spinner";
import { msg } from "../../../../language";
import { Button } from "../../../../components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaWind } from "react-icons/fa6";
import React from "react";

const daysOfWeek = () => {
  return [
    msg.week_days.monday,
    msg.week_days.tuesday,
    msg.week_days.wednesday,
    msg.week_days.thursday,
    msg.week_days.friday,
  ];
};

const formatSecondsFromMidnight = (seconds: number): string => {
  const startHour = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const startMinute = ((seconds % 3600) / 60).toString().padStart(2, "0");

  return `${startHour}:${startMinute}`;
};

const formatTimeframe = (timeframe: TimetableEntry["timeframe"]) => {
  return `${formatSecondsFromMidnight(timeframe.since_midnight_seconds)} - ${formatSecondsFromMidnight(timeframe.since_midnight_seconds + timeframe.length)}`;
};

// Helper function to merge multiple timetables
const mergeTimetables = (timetables: Timetable[]): Timetable => {
  const mergedEntries: Record<string, TimetableEntry[]> = {};

  timetables.forEach((timetable) => {
    Object.entries(timetable.entries).forEach(([day, entries]) => {
      if (!mergedEntries[day]) {
        mergedEntries[day] = [];
      }
      mergedEntries[day].push(...entries);
    });
  });

  return { ...timetables[0], entries: mergedEntries };
};

// Function to generate timetable entry JSX
const generateTimetableEntry = (entry: TimetableEntry) => (
  <div className="rounded p-1 hover:bg-white/10">
    <div className="flex flex-row items-center gap-2">
      <div className="flex flex-col">
        <span className="font-bold">{entry.subject.name}</span>
        <div>
          ({entry.teacher.first_name} {entry.teacher.last_name})
        </div>
      </div>
      <p className="ml-auto flex h-6 items-center justify-center rounded border p-2 font-bold text-black dark:text-white">
        {entry.room.display}
      </p>
    </div>
  </div>
);

const generateTimetableEntryMobile = (entry: TimetableEntry) => (
  <div className="block w-full border-t-[0.1rem] border-gray-200 bg-gray-100 p-3 dark:bg-slate-800">
    <div className="flex items-center">
      <p className="block text-gray-400">
        <span>
          {formatSecondsFromMidnight(entry.timeframe.since_midnight_seconds)}
        </span>
        <br />
        <span>
          {formatSecondsFromMidnight(
            entry.timeframe.since_midnight_seconds + entry.timeframe.length,
          )}
        </span>
      </p>
      <p className="ml-4 block">
        <span className="text-black dark:text-white">{entry.subject.name}</span>
        <br />
        <span className="text-sm">
          <span className="text-gray-400">{entry.room.display}</span>{" "}
          <span className="ml-1 text-gray-500 dark:text-white">
            {entry.teacher.first_name} {entry.teacher.last_name}
          </span>
        </span>
      </p>
    </div>
  </div>
);

// Modified transformTimetable function
const transformTimetable = (timetable: Timetable) => {
  const transformed: Record<string, Record<string, JSX.Element>> = {};
  const transformedMobile: Record<string, Record<string, JSX.Element>> = {};
  const timeRangeMap: Record<string, number> = {};

  for (const [day, entries] of Object.entries(timetable.entries)) {
    entries.forEach((entry) => {
      const timeRange = formatTimeframe(entry.timeframe);
      if (!transformed[timeRange]) {
        transformed[timeRange] = {};
        transformedMobile[timeRange] = {};
        timeRangeMap[timeRange] = entry.timeframe.since_midnight_seconds;
      }

      if (transformed[timeRange][day]) {
        transformed[timeRange][day] = (
          <>
            {transformed[timeRange][day]}
            <div className="mb-2 pt-2">{generateTimetableEntry(entry)}</div>
          </>
        );

        transformedMobile[timeRange][day] = (
          <>
            {transformedMobile[timeRange][day]}
            <div className="mb-4">{generateTimetableEntryMobile(entry)}</div>
          </>
        );
      } else {
        transformed[timeRange][day] = generateTimetableEntry(entry);
        transformedMobile[timeRange][day] = generateTimetableEntryMobile(entry);
      }
    });
  }

  return { transformed, transformedMobile, timeRangeMap };
};

// Timetable table component
const TimetableTable = ({
  timetables,
  currentDate,
  currentDayIndex,
}: {
  timetables: Timetable[];
  currentDate: Date;
  currentDayIndex: number;
}) => {
  const mergedTimetable = useMemo(
    () => mergeTimetables(timetables),
    [timetables],
  );

  const { transformed, transformedMobile, timeRangeMap } = useMemo(
    () => transformTimetable(mergedTimetable),
    [mergedTimetable],
  );

  const sortedTimeRanges = useMemo(
    () =>
      Object.keys(timeRangeMap).sort(
        (a, b) => timeRangeMap[a] - timeRangeMap[b],
      ),
    [timeRangeMap],
  );

  const days = Object.keys(mergedTimetable.entries);

  const daysOfWeekDates = [
    new Date(
      new Date(currentDate).setDate(
        currentDate.getDate() - currentDate.getDay() + 1,
      ),
    ).toLocaleDateString(),
    new Date(
      new Date(currentDate).setDate(
        currentDate.getDate() - currentDate.getDay() + 2,
      ),
    ).toLocaleDateString(),
    new Date(
      new Date(currentDate).setDate(
        currentDate.getDate() - currentDate.getDay() + 3,
      ),
    ).toLocaleDateString(),
    new Date(
      new Date(currentDate).setDate(
        currentDate.getDate() - currentDate.getDay() + 4,
      ),
    ).toLocaleDateString(),
    new Date(
      new Date(currentDate).setDate(
        currentDate.getDate() - currentDate.getDay() + 5,
      ),
    ).toLocaleDateString(),
  ];

  return (
    <>
      <table className="hidden w-full min-w-full divide-y divide-gray-200 lg:table dark:divide-gray-700">
        <thead>
          <tr>
            <th className="w-[120px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"></th>
            {/* Desktop: Show all five days */}
            {days.map((day, index) => (
              <th
                key={day}
                className="hidden w-[120px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell dark:text-gray-300"
              >
                <div className="flex flex-col items-start">
                  <span>{daysOfWeek()[index]}</span>
                  <span className="text-xs text-gray-500">
                    {daysOfWeekDates[index]}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="relative divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {sortedTimeRanges.map((timeRange) => (
            <tr key={timeRange}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                {timeRange}
              </td>
              {/* Desktop: Show all five days */}
              {days.map((day) => (
                <td
                  key={day}
                  className="hidden w-[18%] min-w-[18%] max-w-[18%] px-6 py-4 text-sm text-gray-500 md:table-cell dark:text-gray-400"
                >
                  {transformed[timeRange][day] || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="block lg:hidden">
        {sortedTimeRanges.map((timeRange) => (
          <React.Fragment key={timeRange}>
            {transformedMobile[timeRange][days[currentDayIndex]]}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

// Main component for student timetable page
export default function StudentTimetablePage() {
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();

    // If today is Saturday (6) or Sunday (0), calculate the next Monday
    if (dayOfWeek === 6) {
      // Saturday: Add 2 days to get to Monday
      today.setDate(today.getDate() + 2);
    } else if (dayOfWeek === 0) {
      // Sunday: Add 1 day to get to Monday
      today.setDate(today.getDate() + 1);
    }

    // Otherwise, return today (Monday to Friday)
    return today;
  });

  const [currentDayIndex, setCurrentDayIndex] = useState(
    [6, 0].includes(new Date().getDay()) ? 0 : (new Date().getDay() + 6) % 7,
  ); // State for tracking which day to display on mobile

  console.log({ currentDate, currentDayIndex });

  const {
    data: timetables,
    error: timetableError,
    isLoading: timetableLoading,
  } = useQuery(["timetables", currentDate], () => getTimetable(currentDate), {
    keepPreviousData: true,
  });

  const handlePreviousDay = () => {
    if (currentDayIndex === 0) {
      setCurrentDayIndex(4);
      handlePreviousWeek();
      return;
    }
    setCurrentDayIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextDay = () => {
    if (currentDayIndex === 4) {
      setCurrentDayIndex(0);
      handleNextWeek();
      return;
    }
    setCurrentDayIndex((prevIndex) => Math.min(prevIndex + 1, 4));
  };

  const handlePreviousWeek = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 7);
      return newDate;
    });
  };

  const handleNextWeek = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 7);
      return newDate;
    });
  };

  if (timetableLoading) return <LoadingSpinner />;
  if (timetableError)
    return (
      <div className="text-black dark:text-white">
        {msg.universal.server_side_error}
      </div>
    );

  const btns = (
    <>
      <div className="my-4 flex items-center justify-between text-black lg:hidden dark:text-white">
        <Button onClick={handlePreviousDay}>
          <IoIosArrowBack />
        </Button>

        <span className="font-semibold">
          {daysOfWeek()[currentDayIndex]}
          {", "}
          {new Date(
            currentDate.getTime() + currentDayIndex * 24 * 60 * 60 * 1000,
          ).toLocaleDateString()}
        </span>

        <Button onClick={handleNextDay}>
          <IoIosArrowForward />
        </Button>
      </div>
      <div className="my-4 hidden justify-between lg:flex">
        <Button onClick={handlePreviousWeek}>
          <IoIosArrowBack />
          {msg.timetable_tab_buttons.week_ago}
        </Button>

        <Button onClick={handleNextWeek}>
          {msg.timetable_tab_buttons.next_week}
          <IoIosArrowForward />
        </Button>
      </div>
    </>
  );

  return timetables!.length > 0 ? (
    <>
      <h1 className="text-2xl font-bold dark:text-white">
        {msg.universal.timetable}
      </h1>

      {btns}

      <TimetableTable
        timetables={timetables!}
        currentDate={currentDate}
        currentDayIndex={currentDayIndex}
      />
    </>
  ) : (
    <>
      <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
        {msg.tabs.timetable}
      </h2>

      {btns}

      <span className="text-black dark:text-white">
        <div className="mt-6 flex flex-col items-center justify-center gap-2">
          <FaWind className="text-4xl" />
          <span className="text-2xl">{msg.timetable_general.no_lessons}</span>
        </div>

        <div className="mt-2 flex items-center justify-center font-semibold italic">
          <div className="hidden lg:block">
            (
            {new Date(
              new Date().setDate(
                new Date().getDate() - new Date().getDay() + 1,
              ),
            ).toLocaleDateString()}
            {" - "}
            {new Date(
              new Date().setDate(
                new Date().getDate() - new Date().getDay() + 5,
              ),
            ).toLocaleDateString()}
            )
          </div>
        </div>
      </span>
    </>
  );
}
