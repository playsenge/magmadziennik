import { lazy, Suspense, useState } from "react";
import { Button } from "../../../../components/ui/button";
import LoadingSpinner from "../../../../components/loading-spinner";
import Modal from "../../../../components/modal";
import { AnimatePresence } from "framer-motion";
import { msg } from "../../../../language";
const EditGradesModal = lazy(() => import("./modals/EditGradesModal"));

export default function TeacherHomeTab() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div>HomeTab!</div>

      <Button onClick={() => setIsModalOpen(true)}>
        Open grades modal example
      </Button>

      <AnimatePresence mode="wait">
        {isModalOpen && (
          <Suspense fallback={<LoadingSpinner />}>
            <Modal
              className="h-3/4 min-w-[50%]"
              heading={msg.teacher_editors.grades_editor}
            >
              <EditGradesModal hook={setIsModalOpen} />
            </Modal>
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}
