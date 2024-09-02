import { useQuery } from "react-query";
import { Timetable, TimetableEntry } from "../../../../database/interfaces";
import { getTimetable } from "../../../../database/pocketbase";
import LoadingSpinner from "../../../../components/loading-spinner";
import { msg } from "../../../../language";
import { Button } from "../../../../components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const daysOfWeek = [
  msg.week_days.monday,
  msg.week_days.tuesday,
  msg.week_days.wednesday,
  msg.week_days.thursday,
  msg.week_days.friday,
];

const timeTableArrow = (
  <div className="absolute inset-x-0 bottom-0 top-[67%]">
    <div className="relative">
      <div className="size-0 border-y-[9px] border-l-[9px] border-y-transparent border-l-rose-600"></div>
      <hr className="absolute inset-x-0 bottom-0 top-2 h-[2px] border-0 bg-rose-600 opacity-50" />
    </div>
  </div>
);

function formatTimeframe(timeframe: TimetableEntry["timeframe"]) {
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
}

function TimetableTable({ timetable }: { timetable: Timetable }) {
  const transformTimetable = () => {
    const transformed: Record<string, Record<string, JSX.Element>> = {};

    for (const [day, entries] of Object.entries(timetable.entries)) {
      entries.forEach((entry) => {
        const timeRange = formatTimeframe(entry.timeframe);

        if (!Object.prototype.hasOwnProperty.call(transformed, timeRange)) {
          transformed[timeRange] = {};
        }

        transformed[timeRange][day.toString()] = (
          <div className="rounded p-1 hover:bg-white/10">
            <div className="flex flex-row gap-2 ">
              <span className="font-bold ">{entry.subject.name}</span>
              <p className="order-2 ml-auto flex size-6 items-center justify-center rounded border font-bold text-white">{Math.floor(Math.random() * 70)}</p>
            </div>
          <div>({entry.teacher.first_name} {entry.teacher.last_name})</div>
          </div>
          
        );
      });
    }

    return transformed;
  };

  const transformedTimetable = transformTimetable();

  // Sort timeRanges by start time
  const sortedTimeRanges = Object.keys(transformedTimetable).sort((a, b) => {
    const [startHourA, startMinuteA] = a.split(" - ")[0].split(":").map(Number);
    const [startHourB, startMinuteB] = b.split(" - ")[0].split(":").map(Number);

    if (startHourA !== startHourB) return startHourA - startHourB;
    return startMinuteA - startMinuteB;
  });

  const days = Object.keys(timetable.entries);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold text-white">Timetable</h2>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
            </th>
            {days.map((day) => (
              <th
                key={day}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                {daysOfWeek[Number(day)]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="relative divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {timeTableArrow}

          {sortedTimeRanges.map((timeRange) => (
            <tr key={timeRange}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                {timeRange}
              </td>
              {days.map((day) => (
                <td
                  key={day}
                  className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400"
                >
                  {transformedTimetable[timeRange][day] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Button className="float-left mt-2"><IoIosArrowBack />{msg.timetable_tab_buttons.week_ago}</Button>
      <Button className="float-right mt-2">{msg.timetable_tab_buttons.next_week}<IoIosArrowForward /></Button>
    </div>
  );
}

export default function TimetablePage() {
  const { data: timetable, error: timetableError } = useQuery("timetable", () =>
    getTimetable(new Date()),
  );

  return (
    <>
      {timetable ? (
        <TimetableTable timetable={timetable} />
      ) : timetableError ? (
        msg.universal.server_side_error
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}
