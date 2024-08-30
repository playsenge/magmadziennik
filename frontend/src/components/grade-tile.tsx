import { Grade } from "../database/interfaces";

export default function GradeTile({
  grade,
  subject,
}: {
  grade: Grade;
  subject: string;
}) {
  return (
    <div className="size-16 rounded text-white">
      <p
        className="flex h-12 w-16 flex-col items-center justify-center rounded-t border-2 text-3xl"
        style={{
          borderColor: grade.color,
          color: grade.color,
        }}
      >
        {grade.text}
      </p>
      <p className="flex h-5 w-16 items-center justify-center rounded-b bg-red-500 text-xs">
        {subject}
      </p>
    </div>
  );
}
