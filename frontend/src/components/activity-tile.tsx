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
      className={`mx-auto mt-2 w-11/12 rounded-xl ${unreadBorder && "border-2 border-green-500"} bg-slate-100 p-2 shadow-xl`}
    >
      <span className="text-xl font-semibold">{getHeaderMessage()}</span>
      <span className="float-end">{meta}</span>
      <br />
      <span className="text-sm">{description}</span>
      <span className="float-end">
        {date.toLocaleDateString()}
        {includeTime ? " " + date.toLocaleTimeString() : ""}
      </span>
    </div>
  );
}

export default memo(ActivityTile);
