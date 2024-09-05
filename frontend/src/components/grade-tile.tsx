import { memo } from "react";
import { Grade } from "../database/interfaces";
import { msg } from "../language";
import HoverDetail from "./hover-detail";

export function GradeTile({ grade }: { grade: Grade }) {
  return (
    <div className="group size-16 cursor-default rounded text-white">
      <p
        className="flex h-12 w-[4.5rem] flex-col items-center justify-center rounded-t border-2 text-3xl"
        style={{
          borderColor: grade.grade.color,
          color: grade.grade.color,
        }}
      >
        {grade.grade.text}
      </p>
      <p
        className="flex h-6 w-[4.5rem] items-center justify-center rounded-b text-xs"
        style={{
          backgroundColor: grade.grade.color,
        }}
      >
        {grade.subject.shorthand}
      </p>
      <HoverDetail>
        <p>
          {msg.grade_details.weight}: {grade.weight}
        </p>
        <p>
          {msg.grade_details.teacher}: {grade.teacher.first_name}{" "}
          {grade.teacher.last_name}
        </p>
        <p>
          {msg.grade_details.date}: {grade.created.toLocaleString()}
        </p>
        <p>
          {msg.grade_details.value}: {grade.grade.value}
        </p>
      </HoverDetail>
    </div>
  );
}

export default memo(GradeTile);
