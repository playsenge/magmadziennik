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
          <Modal
            className="max-h-screen min-h-screen min-w-full"
            heading={msg.teacher_editors.grades_editor}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <EditGradesModal hook={setIsModalOpen} />
            </Suspense>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
