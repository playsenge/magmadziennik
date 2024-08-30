import { memo } from "react";
import { GradeModel, Subject } from "../database/interfaces";
import { msg } from "../language";

export function GradeTile({
  grade,
  subject,
}: {
  grade: GradeModel;
  subject: Subject;
}) {
  return (
    <div className="group size-16 cursor-default rounded text-white">
      <p
        className="flex h-12 w-[4.5rem] flex-col items-center justify-center rounded-t border-2 text-3xl"
        style={{
          borderColor: grade.color,
          color: grade.color,
        }}
      >
        {grade.text}
      </p>
      <p
        className="flex h-6 w-[4.5rem] items-center justify-center rounded-b text-xs"
        style={{
          backgroundColor: grade.color,
        }}
      >
        {subject.shorthand}
      </p>
      <div className="mt-2 hidden w-56 rounded-r-xl bg-slate-950/40 p-1 text-xs text-white group-hover:block">
        <p>{msg.grade_details.weight}: 69</p>
        <p>{msg.grade_details.teacher}: Andrzej Pierdziwór</p>
        <p>{msg.grade_details.date}: 10.10.1010 25:30</p>
        <p>{msg.grade_details.value}: 69420</p>
      </div>
    </div>
  );
}

export default memo(GradeTile);
