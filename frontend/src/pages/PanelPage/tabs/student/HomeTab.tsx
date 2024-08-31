import { motion } from "framer-motion";
import { msg } from "../../../../language";
import GradeTile from "../../../../components/grade-tile";
import { memo } from "react";
import { getStudentGrades } from "../../../../database/pocketbase";
import LoadingSpinner from "../../../../components/loading-spinner";
import { useQuery } from "react-query";
import ActivityTile from "../../../../components/activity-tile";

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
  const { data: grades, error: gradesError } = useQuery(
    "grades",
    getStudentGrades,
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <AnimatedTile className="scale-50">
        <h1 className="m-3 text-4xl">{msg.universal.grades}</h1>
        <div className="flex flex-row gap-5 *:aspect-square *:w-16 *:p-5 *:text-center">
          {grades ? (
            grades.map((grade) => <GradeTile key={grade.id} grade={grade} />)
          ) : !gradesError ? (
            <span>
              <LoadingSpinner />
            </span>
          ) : (
            msg.universal.server_side_error
          )}
        </div>
      </AnimatedTile>
      <AnimatedTile>
        <h1 className="m-3 text-4xl">{msg.tabs.tests}</h1>
        <p className="ms-3 mt-0">{msg.home_tab_tests.this_week}2</p>
        <div className="max-h-[60%] overflow-y-auto">
          <ActivityTile
            subject="Matematyka"
            description="Logarytmy"
            type="test"
            date={new Date(2022, 10, 11)}
          />
          <ActivityTile
            subject="Język polski"
            description='Lektura "Konrad Walikoń"'
            type="quiz"
            date={new Date(2022, 10, 16)}
          />
        </div>
      </AnimatedTile>
      <AnimatedTile>
        <h1 className="m-3 text-4xl">{msg.tabs.homework}</h1>
        <p className="ms-3 mt-0">{msg.home_tab_homework.this_week}2</p>
        <div className="max-h-[60%] overflow-y-auto">
          <ActivityTile
            subject="Fizyka"
            description="Przeczytać strony 10-120 bo jest początek roku i już zalegamy z
              materiałem xdd"
            type="homework"
            date={new Date(2022, 8, 3)}
          />
          <ActivityTile
            subject="Historia"
            description="Prezentacja nt. II Wojny Skibidi"
            type="homework"
            date={new Date(2022, 8, 5)}
          />
        </div>
      </AnimatedTile>
      <AnimatedTile className="col-span-2 hidden lg:block">
        <h1 className="m-3 text-4xl">{msg.universal.timetable}</h1>
      </AnimatedTile>
      <AnimatedTile className="hidden lg:block">
        <h1 className="m-3 text-4xl">{msg.tabs.attendance}</h1>
        <p className="my-auto flex items-center justify-center text-8xl font-bold">
          87%
        </p>
        <p className="ms-5 mt-4">
          {msg.home_tab_attendance.lowest}Historia - 66%
        </p>
      </AnimatedTile>
      <AnimatedTile>
        <h1 className="m-3 text-4xl">{msg.tabs.messages}</h1>
        <p className="ms-3 mt-0">1{msg.home_tab_messages.unread_singular}</p>
        <div className="max-h-[60%] overflow-y-auto">
          <div className="mx-auto mt-2 w-11/12 rounded-xl border-slate-700 bg-slate-100 p-2 shadow-xl">
            <span className="text-xl">Mariusz Kiła</span>
            <span className="float-end">Odwołana lekcja</span>
            <br />
            <span className="text-sm">
              Historia o 8 rano odwołana mozna spac dluzej !!!
            </span>
            <span className="float-end">03.09.2022 08:05</span>
          </div>
          <div className="mx-auto mt-2 w-11/12 rounded-xl border-slate-700 bg-slate-100 p-2 shadow-xl">
            <span className="text-xl">Anna Kula</span>
            <span className="float-end">Zwrot książek</span>
            <br />
            <span className="text-sm">
              Ten kto nie zwróci książek zostanie zabity :-)
            </span>
            <span className="float-end">03.09.2022 08:05</span>
          </div>
          <div className="mx-auto mt-2 w-11/12 rounded-xl border-slate-700 bg-slate-100 p-2 shadow-xl">
            <span className="text-xl">Mariusz Kiła</span>
            <span className="float-end">Zmiana planu lekcji</span>
            <br />
            <span className="text-sm">
              pprsze wszystkih o sprawdzenie sal bo byly tez korekty sal
            </span>
            <span className="float-end">03.09.2022 08:05</span>
          </div>
        </div>
      </AnimatedTile>
      <AnimatedTile className="col-span-2 hidden lg:block">
        <h1 className="m-3 text-4xl">idk</h1>
      </AnimatedTile>
    </div>
  );
}
