import { AnimatePresence, motion } from "framer-motion";
import { msg } from "../../../language";
import { config } from "../../../config";
import GradeTile from "../../../components/grade-tile";
import { memo } from "react";

export default function HomeTab() {
  const AnimatedTile = memo(
    ({
      children,
      className,
    }: {
      children: JSX.Element | JSX.Element[] | string;
      className?: string;
    }) => (
      <AnimatePresence>
        <motion.div
          className={`h-64 rounded-2xl bg-white ${className ?? ""}`}
          animate={{ scale: 1, type: "inertia", opacity: 1 }}
          transition={{ duration: 0.5 }}
          initial={{ scale: 0, opacity: 0 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    ),
  );

  return (
    <>
      <div className="">
        <div className="grid grid-cols-3 gap-4">
          <AnimatedTile className="scale-50">
            <h1 className="m-3 text-4xl">{msg.universal.grades}</h1>
            <div className="flex flex-row gap-5 *:aspect-square *:w-16 *:p-5 *:text-center">
              <GradeTile grade={config.grades[0]} subject={"Fizyka"} />
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
      </div>
    </>
  );
}
