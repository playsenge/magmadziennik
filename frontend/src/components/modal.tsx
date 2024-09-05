import { motion } from "framer-motion";

interface Props {
  children: JSX.Element | JSX.Element[] | string;
  heading?: string;
  className?: string;
}

export default function Modal({ children, heading, className }: Props) {
  const transitionDuration = 0.15;

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/75"
        aria-hidden="true"
        transition={{ duration: transitionDuration, ease: "easeInOut" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      ></motion.div>

      <motion.div
        className="fixed inset-0 z-10 w-screen overflow-y-auto"
        transition={{ duration: transitionDuration, ease: "easeInOut" }}
        initial={{ opacity: 0, scale: 0.75, y: 0 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{
          opacity: 0,
          scale: 0.75,
          transition: {
            duration: transitionDuration,
          },
        }}
      >
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            className={`relative w-full max-w-lg overflow-hidden rounded-lg bg-white p-8 text-left shadow-sm dark:bg-slate-800 dark:shadow-gray-900 ${
              className || ""
            }`}
          >
            {heading && (
              <h1 className="mb-10 text-2xl font-semibold text-black dark:text-white">
                {heading}
              </h1>
            )}

            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
