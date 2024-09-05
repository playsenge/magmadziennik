import { useState, useMemo } from "react";
import { useQuery } from "react-query";
import { Timetable, TimetableEntry } from "../../../../database/interfaces";
import { getTimetable } from "../../../../database/pocketbase";
import LoadingSpinner from "../../../../components/loading-spinner";
import { msg } from "../../../../language";
import { Button } from "../../../../components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Formats the timeframe for display
const formatTimeframe = (timeframe: TimetableEntry["timeframe"]) => {
  const startHour = Math.floor(timeframe.since_midnight_seconds / 3600)
    .toString()
    .padStart(2, "0");
  const startMinute = ((timeframe.since_midnight_seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const endHour = Math.floor(
    (timeframe.since_midnight_seconds + timeframe.length) / 3600,
  )
    .toString()
    .padStart(2, "0");
  const endMinute = (
    ((timeframe.since_midnight_seconds + timeframe.length) % 3600) /
    60
  )
    .toString()
    .padStart(2, "0");

  return `${startHour}:${startMinute} - ${endHour}:${endMinute}`;
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
    <div className="flex flex-row gap-2">
      <span className="font-bold">{entry.subject.name}</span>
      <p className="order-2 ml-auto flex h-6 min-w-6 items-center justify-center rounded border p-2 font-bold text-black dark:text-white">
        {entry.room.display}
      </p>
    </div>
    <div>
      ({entry.teacher.first_name} {entry.teacher.last_name})
    </div>
  </div>
);

// Modified transformTimetable function
const transformTimetable = (timetable: Timetable) => {
  const transformed: Record<string, Record<string, JSX.Element>> = {};
  const timeRangeMap: Record<string, number> = {};

  for (const [day, entries] of Object.entries(timetable.entries)) {
    entries.forEach((entry) => {
      const timeRange = formatTimeframe(entry.timeframe);
      if (!transformed[timeRange]) {
        transformed[timeRange] = {};
        timeRangeMap[timeRange] = entry.timeframe.since_midnight_seconds;
      }

      if (transformed[timeRange][day]) {
        transformed[timeRange][day] = (
          <>
            {transformed[timeRange][day]}
            <div className="mb-2 border-b border-gray-300 pt-1">
              {generateTimetableEntry(entry)}
            </div>
          </>
        );
      } else {
        transformed[timeRange][day] = generateTimetableEntry(entry);
      }
    });
  }

  return { transformed, timeRangeMap };
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

  const { transformed, timeRangeMap } = useMemo(
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
  const daysOfWeek = [
    msg.week_days.monday,
    msg.week_days.tuesday,
    msg.week_days.wednesday,
    msg.week_days.thursday,
    msg.week_days.friday,
  ];

  const daysOfWeekDates = [
    new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1),
    ).toLocaleDateString(),
    new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 2),
    ).toLocaleDateString(),
    new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 3),
    ).toLocaleDateString(),
    new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 4),
    ).toLocaleDateString(),
    new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 5),
    ).toLocaleDateString(),
  ];

  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead>
        <tr>
          <th className="w-[120px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"></th>
          {/* Mobile: Only show one day */}
          <th className="block w-[120px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:hidden dark:text-gray-300">
            <div className="flex flex-col items-start">
              <span>{daysOfWeek[currentDayIndex]}</span>
              <span className="text-xs text-gray-500">
                {daysOfWeekDates[currentDayIndex]}
              </span>
            </div>
          </th>
          {/* Desktop: Show all five days */}
          {days.map((day, index) => (
            <th
              key={day}
              className="hidden w-[120px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell dark:text-gray-300"
            >
              <div className="flex flex-col items-start">
                <span>{daysOfWeek[index]}</span>
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
            {/* Mobile: Only show one day */}
            <td className="block w-[18%] min-w-[18%] max-w-[18%] px-6 py-4 text-sm text-gray-500 md:hidden dark:text-gray-400">
              {transformed[timeRange][days[currentDayIndex]] || "-"}
            </td>
            {/* Desktop: Show all five days */}
            {days.map((day) => (
              <td
                key={day}
                className="hidden w-[18%] min-w-[18%] max-w-[18%] px-6 py-4 text-sm text-gray-500 md:table-cell dark:text-gray-400"
              >
                {transformed[timeRange][day] || "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Main component for student timetable page
export default function StudentTimetablePage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentDayIndex, setCurrentDayIndex] = useState(0); // State for tracking which day to display on mobile

  const {
    data: timetables,
    error: timetableError,
    isLoading: timetableLoading,
  } = useQuery(["timetables", currentDate], () => getTimetable(currentDate), {
    keepPreviousData: true,
  });

  const handlePreviousDay = () => {
    setCurrentDayIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNextDay = () => {
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
  if (timetableError) return <div>{msg.universal.server_side_error}</div>;

  const btns = (
    <>
      <div className="mb-4 flex justify-between">
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

      <div className="my-4 flex justify-between">
        <Button
          className="lg:hidden"
          onClick={handlePreviousDay}
          disabled={currentDayIndex === 0}
        >
          <IoIosArrowBack />
          {msg.timetable_tab_buttons.previous_day}
        </Button>

        <Button
          className="lg:hidden"
          onClick={handleNextDay}
          disabled={currentDayIndex === 4}
        >
          {msg.timetable_tab_buttons.next_day}
          <IoIosArrowForward />
        </Button>
      </div>
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
        {msg.timetable_general.no_lessons} (
        {new Date(
          currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1),
        ).toLocaleDateString()}
        {" - "}
        {new Date(
          currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 5),
        ).toLocaleDateString()}
        )
      </span>
    </>
  );
}
