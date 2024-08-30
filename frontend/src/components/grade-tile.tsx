import { Grade } from "../database/interfaces";

export default function GradeTile({ grade }: { grade: Grade }) {
  return (
    <span
      className="flex size-10 items-center justify-center rounded-xl border-4 p-6 text-xl font-semibold"
      style={{
        borderColor: grade.color,
        color: grade.color,
      }}
    >
      {grade.text}
    </span>
  );
}
