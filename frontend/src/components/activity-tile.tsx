import { memo } from "react";
import { msg } from "../language";

export function ActivityTile({
  meta,
  description,
  date,
  header,
  includeTime,
  unreadBorder,
}: {
  meta: string;
  description: string;
  date: Date;
  header: "test" | "quiz" | "homework" | string;
  includeTime?: boolean;
  unreadBorder?: boolean;
}) {
  const getHeaderMessage = () => {
    switch (header) {
      case "test":
        return msg.home_tab_tests.test;
      case "quiz":
        return msg.home_tab_tests.quiz;
      case "homework":
        return msg.home_tab_homework.homework;
      default:
        return header;
    }
    return "N/A";
  };

  return (
    <div
      className={`mx-auto mt-2 w-11/12 rounded-xl ${unreadBorder && "border-2 border-green-500"} flex flex-col bg-slate-100 p-3 shadow-xl`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold">{getHeaderMessage()}</span>
        <span className="ml-auto">{meta}</span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm">{description}</span>
        <span className="ml-auto text-sm">
          {date.toLocaleDateString()}
          {includeTime ? " " + date.toLocaleTimeString() : ""}
        </span>
      </div>
    </div>
  );
}

export default memo(ActivityTile);
