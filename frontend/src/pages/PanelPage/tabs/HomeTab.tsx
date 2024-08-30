import { AnimatePresence, motion } from "framer-motion";
import { msg } from "../../../language";
import Grade from "../../../components/grade";

export default function HomeTab() {
  return <>
    <div className="">
      <div className="grid grid-cols-3 gap-4">
        <AnimatePresence>
          <motion.div className="h-64 scale-50 rounded-2xl bg-white"
              animate={{scale: 1, type: "inertia", opacity: 1}}
              transition={{duration: 0.5}}
              initial={{scale: 0, opacity: 0}}>
            <h1 className="m-3 text-4xl">{msg.universal.grades}</h1>
              <div className="flex flex-row gap-5 *:aspect-square *:w-16 *:p-5 *:text-center">
              <Grade grade={"2+"} subject={"Fizyka"} color1={"bg-red-200"} color2={"bg-red-500"}/>
              </div>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          <motion.div className="h-64 rounded-2xl bg-white"
              animate={{scale: 1, type: "inertia", opacity: 1}}
              transition={{duration: 0.5, delay: 0.05}}
              initial={{scale: 0, opacity: 0}}>
            <h1 className="m-3 text-4xl">{msg.tabs.tests}</h1>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          <motion.div className="h-64 rounded-2xl bg-white"
           animate={{scale: 1, type: "inertia", opacity: 1}}
           transition={{duration: 0.5, delay: 0.1}}
           initial={{scale: 0, opacity: 0}}>
            <h1 className="m-3 text-4xl">{msg.tabs.homework}</h1>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          <motion.div className="col-span-2 h-64 rounded-2xl bg-white"
           animate={{scale: 1, type: "inertia", opacity: 1}}
           transition={{duration: 0.5, delay: 0.15}}
           initial={{scale: 0, opacity: 0}}>
            <h1 className="m-3 text-4xl">{msg.universal.timetable}</h1>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          <motion.div className="h-64 rounded-2xl bg-white"
           animate={{scale: 1, type: "inertia", opacity: 1}}
           transition={{duration: 0.5, delay: 0.2}}
           initial={{scale: 0, opacity: 0}}>
            <h1 className="m-3 text-4xl">{msg.tabs.attendance}</h1>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          <motion.div className="h-64 rounded-2xl bg-white"
            animate={{scale: 1, type: "inertia", opacity: 1}}
            transition={{duration: 0.5, delay: 0.25}}
            initial={{scale: 0, opacity: 0}}>
            <h1 className="m-3 text-4xl">{msg.tabs.messages}</h1>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          <motion.div className="col-span-1 h-64 rounded-2xl bg-white"
              animate={{scale: 1, type: "inertia", opacity: 1}}
              transition={{duration: 0.5, delay: 0.3}}
              initial={{scale: 0, opacity: 0}}>
            <h1 className="m-3 text-4xl">idk</h1>
          </motion.div>
        </AnimatePresence>
      </div>

    </div >
  </>;
}
