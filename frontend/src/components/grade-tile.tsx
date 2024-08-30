import { memo } from "react";
import { Grade, Subject } from "../database/interfaces";

export function GradeTile({
  grade,
  subject,
}: {
  grade: Grade;
  subject: Subject;
}) {
  return (
    <div className="size-16 rounded text-white">
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
    </div>
  );
}

export default memo(GradeTile);
