import { useState, useMemo } from "react";
import { useQuery } from "react-query";
import { Timetable, TimetableEntry } from "../../../../database/interfaces";
import { getTimetable } from "../../../../database/pocketbase";
import LoadingSpinner from "../../../../components/loading-spinner";
import { msg } from "../../../../language";
import { Button } from "../../../../components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

// Arrow component for the timetable
const TimeTableArrow = () => (
  <div className="absolute inset-x-0 bottom-0 top-[67%]">
    <div className="relative">
      <div className="size-0 border-y-[9px] border-l-[9px] border-y-transparent border-l-rose-600"></div>
      <hr className="absolute inset-x-0 bottom-0 top-2 h-[2px] border-0 bg-rose-600 opacity-50" />
    </div>
  </div>
);

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
      {/* <div className="order-2 flex size-7 items-center justify-center rounded-[50%] border-2 border-red-500 font-bold text-red-500" title="Nieobecność nieusprawiedliwiona">N</div> */}
      {/* <div className="order-2 flex size-7 items-center justify-center rounded-[50%] border-2 border-violet-500 font-bold text-violet-500" title="Nieobecność usprawiedliwiona">NU</div> */}
      {/* <div className="order-2 flex size-7 items-center justify-center rounded-[50%] border-2 border-yellow-500 font-bold text-yellow-500" title="Spóźnienie">S</div> */}
      {/* <div className="order-2 flex size-7 items-center justify-center rounded-[50%] border-2 border-yellow-200 font-bold text-yellow-200" title="Spóźnienie usprawiedliwione">SU</div> */}
      {/* <div className="order-2 flex size-7 items-center justify-center rounded-[50%] border-2 border-blue-200 font-bold text-blue-200" title="Zwolnienie">Z</div> */}
      {/* <div className="order-2 flex size-7 items-center justify-center rounded-[50%] border-2 border-indigo-500 font-bold text-indigo-500" title="Nieobecność z przyczyn szkolnych">NS</div> */}
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
}: {
  timetables: Timetable[];
  currentDate: Date;
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
          {days.map((day, index) => (
            <th
              key={day}
              className="w-[120px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
            >
              <div className="flex flex-col items-start">
                <span>{daysOfWeek[Number(day)]}</span>
                <span className="text-xs text-gray-500">
                  {daysOfWeekDates[index]}
                </span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="relative divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {/* <TimeTableArrow /> */}
        {sortedTimeRanges.map((timeRange) => (
          <tr key={timeRange}>
            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
              {timeRange}
            </td>
            {
            days.map((day) => (
              <td
                key={day}
                className="w-[18%] min-w-[18%] max-w-[18%] px-6 py-4 text-sm text-gray-500 dark:text-gray-400"
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

  const {
    data: timetables,
    error: timetableError,
    isLoading: timetableLoading,
  } = useQuery(["timetables", currentDate], () => getTimetable(currentDate), {
    keepPreviousData: true,
  });

  const handlePreviousWeek = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
  };

  const handleNextWeek = () => {
    setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
  };

  if (timetableLoading) {
    return <LoadingSpinner />;
  }

  if (timetableError || !timetables) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold text-white">
          {msg.universal.server_side_error}
        </h2>
      </div>
    );
  }

  const buttons = (
    <>
      <Button
        className="float-left mx-2 mt-2 hidden lg:block"
        onClick={handlePreviousWeek}
      >
        <MdKeyboardDoubleArrowLeft />
        {msg.timetable_tab_buttons.week_ago}
      </Button>
      <Button
        className="float-right mx-2 mt-2 hidden lg:block"
        onClick={handleNextWeek}
      >
        {msg.timetable_tab_buttons.next_week}
        <MdKeyboardDoubleArrowRight />
      </Button>
      <Button
        className="float-left mt-2 block lg:hidden"
        onClick={handlePreviousWeek}
      >
        <IoIosArrowBack />
        {msg.timetable_tab_buttons.previous_day}
      </Button>
      <Button
        className="float-right mt-2 block lg:hidden"
        onClick={handleNextWeek}
      >
        {msg.timetable_tab_buttons.next_day}
        <IoIosArrowForward />
      </Button>
    </>
  );

  return timetables.length > 0 ? (
    <>
      <div className="p-4">
        <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
          {msg.tabs.timetable}
        </h2>
        <TimetableTable timetables={timetables} currentDate={currentDate} />
      </div>
      {buttons}
    </>
  ) : (
    <>
      <div className="p-4">
        <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
          {msg.tabs.timetable}
        </h2>
        <span className="text-black dark:text-white">
          {msg.timetable_general.no_lessons} (
          {new Date(
            currentDate.setDate(
              currentDate.getDate() - currentDate.getDay() + 1,
            ),
          ).toLocaleDateString()}
          {" - "}
          {new Date(
            currentDate.setDate(
              currentDate.getDate() - currentDate.getDay() + 5,
            ),
          ).toLocaleDateString()}
          )
        </span>
      </div>
      {buttons}
    </>
  );
}
