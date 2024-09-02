import { useQuery } from "react-query";
import { Timetable, TimetableEntry } from "../../../../database/interfaces";
import { getTimetable } from "../../../../database/pocketbase";
import LoadingSpinner from "../../../../components/loading-spinner";
import { msg } from "../../../../language";

const daysOfWeek = [
  msg.week_days.monday,
  msg.week_days.tuesday,
  msg.week_days.wednesday,
  msg.week_days.thursday,
  msg.week_days.friday,
];

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
          <div className="flex flex-col gap-2">
            <span className="font-bold">{entry.subject.name}</span>(
            {entry.teacher.first_name} {entry.teacher.last_name})
          </div>
        );
      });
    }

    return transformed;
  };

  const transformedTimetable = transformTimetable();
  const timeRanges = Object.keys(transformedTimetable);
  const days = Object.keys(timetable.entries);

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">Timetable</h2>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
              Hour Ranges
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
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {timeRanges.map((timeRange) => (
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
