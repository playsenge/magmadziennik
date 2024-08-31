import { motion } from "framer-motion";
import { msg } from "../../../../language";
import { config } from "../../../../config";
import GradeTile from "../../../../components/grade-tile";
import { memo } from "react";
import { getSubjects } from "../../../../database/pocketbase";
import LoadingSpinner from "../../../../components/loading-spinner";
import { useQuery } from "react-query";

const AnimatedTile = memo(
  ({
    children,
    className,
  }: {
    children: JSX.Element | JSX.Element[] | string;
    className?: string;
  }) => (
    <motion.div
      className={`h-64 rounded-2xl bg-white ${className ?? ""}`}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "tween" }}
      initial={{ scale: 0, opacity: 0 }}
    >
      {children}
    </motion.div>
  ),
  (prevProps, nextProps) =>
    prevProps.className === nextProps.className &&
    prevProps.children === nextProps.children,
);

export default function StudentHomeTab() {
  const { data: subjects, error: subjectsError } = useQuery(
    "subjects",
    getSubjects,
  );

  if (subjectsError) return msg.universal.server_side_error;

  return (
    <div className="grid grid-cols-3 gap-4">
      <AnimatedTile className="scale-50">
        <h1 className="m-3 text-4xl">{msg.universal.grades}</h1>
        <div className="flex flex-row gap-5 *:aspect-square *:w-16 *:p-5 *:text-center">
          {subjects ? (
            subjects.map((subject, i) => (
              <GradeTile
                key={subject.id}
                grade={config.grades[i]}
                subject={subject}
              />
            ))
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </AnimatedTile>
      <AnimatedTile>
        <h1 className="m-3 text-4xl">{msg.tabs.tests}</h1>
      </AnimatedTile>
      <AnimatedTile>
        <h1 className="m-3 text-4xl">{msg.tabs.homework}</h1>
      </AnimatedTile>
      <AnimatedTile className="col-span-2">
        <h1 className="m-3 text-4xl">{msg.universal.timetable}</h1>
      </AnimatedTile>
      <AnimatedTile>
        <h1 className="m-3 text-4xl">{msg.tabs.attendance}</h1>
      </AnimatedTile>
      <AnimatedTile>
        <h1 className="m-3 text-4xl">{msg.tabs.messages}</h1>
      </AnimatedTile>
      <AnimatedTile className="col-span-2">
        <h1 className="m-3 text-4xl">idk</h1>
      </AnimatedTile>
    </div>
  );
}
