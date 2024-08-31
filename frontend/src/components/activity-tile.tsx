import { memo } from "react";
import { msg } from "../language";

export function ActivityTile({
  subject,
  description,
  date,
  type,
}: {
  subject: string;
  description: string;
  date: Date;
  type: "test" | "quiz" | "homework";
}) {
  const getTypeMessage = () => {
    switch (type) {
      case "test":
        return msg.home_tab_tests.test;
      case "quiz":
        return msg.home_tab_tests.quiz;
      case "homework":
        return msg.home_tab_homework.homework;
    }
    return "N/A";
  };

  return (
    <div className="mx-auto mt-2 w-11/12 rounded-xl border-slate-700 bg-slate-100 p-2 shadow-xl">
      <span className="text-xl font-semibold">{getTypeMessage()}</span>
      <span className="float-end">{subject}</span>
      <br />
      <span className="text-sm">{description}</span>
      <span className="float-end">{date.toLocaleDateString()}</span>
    </div>
  );
}

export default memo(ActivityTile);
