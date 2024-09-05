import { lazy, Suspense, useMemo, useState } from "react";
import { Button } from "../../../../../components/ui/button";
import { msg } from "../../../../../language";
import React from "react";
import LoadingSpinner from "../../../../../components/loading-spinner";

const SchoolClassManager = lazy(() => import("./managers/SchoolClassManager"));
const StudentManager = lazy(() => import("./managers/StudentManager"));
const SubjectManager = lazy(() => import("./managers/SubjectManager"));
const TeacherManager = lazy(() => import("./managers/TeacherManager"));

enum CurrentTab {
  SCHOOL_CLASS_MANAGER,
  TEACHER_MANAGER,
  SUBJECT_MANAGER,
  STUDENT_MANAGER,
}

export default function TeacherAdminTab() {
  const [currentTab, setCurrentTab] = useState<CurrentTab>(
    CurrentTab.SCHOOL_CLASS_MANAGER,
  );

  const tabData = useMemo(
    () => [
      {
        tabName: msg.admin_panel_managers.school_class,
        tabValue: CurrentTab.SCHOOL_CLASS_MANAGER,
        tab: <SchoolClassManager />,
      },
      {
        tabName: msg.admin_panel_managers.teacher,
        tabValue: CurrentTab.TEACHER_MANAGER,
        tab: <TeacherManager />,
      },
      {
        tabName: msg.admin_panel_managers.subject,
        tabValue: CurrentTab.SUBJECT_MANAGER,
        tab: <SubjectManager />,
      },
      {
        tabName: msg.admin_panel_managers.student,
        tabValue: CurrentTab.STUDENT_MANAGER,
        tab: <StudentManager />,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [msg.name],
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-4">
        {tabData.map((element) => (
          <React.Fragment key={element.tabValue}>
            <Button
              variant={currentTab === element.tabValue ? "outline" : "default"}
              className="hidden dark:block"
              onClick={() => setCurrentTab(element.tabValue)}
            >
              {element.tabName}
            </Button>
            <Button
              variant={currentTab === element.tabValue ? "default" : "outline"}
              className="dark:hidden"
              onClick={() => setCurrentTab(element.tabValue)}
            >
              {element.tabName}
            </Button>
          </React.Fragment>
        ))}
      </div>

      <div className="mt-6 overflow-y-auto">
        <Suspense fallback={<LoadingSpinner />}>
          {tabData.find((element) => element.tabValue === currentTab)?.tab}
        </Suspense>
      </div>
    </div>
  );
}
