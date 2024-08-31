import { memo, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pb, userAvatar } from "../../database/pocketbase";
import { UserGeneric } from "../../database/interfaces";
import { msg } from "../../language";
import { LuCalendarDays } from "react-icons/lu";
import { FiMessageSquare } from "react-icons/fi";
import { IoIosCheckmarkCircleOutline, IoIosSettings } from "react-icons/io";
import { RiFilePaper2Line } from "react-icons/ri";
import { FaBars, FaPenFancy } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { AiOutlineAppstore } from "react-icons/ai";

import React from "react";
import LanguageSwitcher from "../../components/language-switcher";
import TransparentCover from "../../components/transparent-cover";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../../components/logo";

import StudentHomeTab from "./tabs/student/HomeTab";
import StudentAttendaceTab from "./tabs/student/AttendanceTab";
import StudentGradesTab from "./tabs/student/GradesTab";
import StudentHomeworkTab from "./tabs/student/HomeworkTab";
import StudentMessagesTab from "./tabs/student/MessagesTab";
import StudentSettingsTab from "./tabs/student/SettingsTab";
import StudentTestsTab from "./tabs/student/TestsTab";
import StudentTimetableTab from "./tabs/student/TimetableTab";
import TeacherHomeTab from "./tabs/teacher/HomeTab";

enum CurrentTab {
  // Student
  STUDENT_HOME,
  STUDENT_TIMETABLE,
  STUDENT_GRADES,
  STUDENT_TESTS,
  STUDENT_HOMEWORK,
  STUDENT_ATTENDANCE,
  STUDENT_SETTINGS,
  // Teacher
  TEACHER_HOME,
  TEACHER_TIMETABLE,
  TEACHER_GRADES,
  TEACHER_HOMEWORK,
  // Universal
  MESSAGES,
}

export default function PanelPage() {
  const navigate = useNavigate();

  const user: UserGeneric = useMemo(
    () => pb.authStore.model as UserGeneric,
    [],
  );

  const teacherPanel = useMemo(
    () => pb.authStore.model?.collectionName === "teachers",
    [],
  );

  const [currentTab, setCurrentTab] = useState<CurrentTab>(
    teacherPanel ? CurrentTab.TEACHER_HOME : CurrentTab.STUDENT_HOME,
  );
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
  }, [navigate]);

  if (!pb.authStore.isValid) return null;
  if (!user) return null;

  const getTimeOfDay = () => {
    const hours = new Date().getHours();

    if (hours >= 6 && hours < 12) return msg.greetings.morning;
    if (hours >= 12 && hours < 18) return msg.greetings.afternoon;
    return msg.greetings.evening;
  };

  const NavTab = memo(
    ({
      icon,
      label,
      value,
    }: {
      icon: JSX.Element;
      label: string;
      value: CurrentTab;
    }) => (
      <span
        className={
          (value === currentTab
            ? "bg-gray-700"
            : "cursor-pointer hover:bg-gray-600") + " block rounded px-4 py-2.5"
        }
        onClick={() => setCurrentTab(value)}
      >
        {React.cloneElement(icon, { className: "me-2 inline text-2xl" })}
        {label}
      </span>
    ),
  );

  const MobileExpander = memo(({ className }: { className: string }) => (
    <button
      className={`block rounded p-2 text-white md:hidden ${className}`}
      onClick={() => setMobileExpanded(!mobileExpanded)}
    >
      <FaBars />
    </button>
  ));

  const NavContents = (
    <>
      <MobileExpander className="absolute right-4 top-4 bg-gray-700" />
      <div className="flex items-center p-4 text-lg font-bold">
        {getTimeOfDay()}, {user.first_name}!
      </div>

      <nav>
        {teacherPanel ? (
          <>
            <NavTab
              icon={<AiOutlineAppstore />}
              label={msg.tabs.home}
              value={CurrentTab.TEACHER_HOME}
            />
            <NavTab
              icon={<LuCalendarDays />}
              label={msg.tabs.timetable}
              value={CurrentTab.TEACHER_TIMETABLE}
            />
            <NavTab
              icon={<FaListCheck />}
              label={msg.tabs.grades}
              value={CurrentTab.TEACHER_GRADES}
            />
            <NavTab
              icon={<RiFilePaper2Line />}
              label={msg.tabs.homework}
              value={CurrentTab.TEACHER_HOMEWORK}
            />
            <NavTab
              icon={<FiMessageSquare />}
              label={msg.tabs.messages}
              value={CurrentTab.MESSAGES}
            />
          </>
        ) : (
          <>
            <NavTab
              icon={<AiOutlineAppstore />}
              label={msg.tabs.home}
              value={CurrentTab.STUDENT_HOME}
            />
            <NavTab
              icon={<LuCalendarDays />}
              label={msg.tabs.timetable}
              value={CurrentTab.STUDENT_TIMETABLE}
            />
            <NavTab
              icon={<FaListCheck />}
              label={msg.tabs.grades}
              value={CurrentTab.STUDENT_GRADES}
            />
            <NavTab
              icon={<FaPenFancy />}
              label={msg.tabs.tests}
              value={CurrentTab.STUDENT_TESTS}
            />
            <NavTab
              icon={<RiFilePaper2Line />}
              label={msg.tabs.homework}
              value={CurrentTab.STUDENT_HOMEWORK}
            />
            <NavTab
              icon={<IoIosCheckmarkCircleOutline />}
              label={msg.tabs.attendance}
              value={CurrentTab.STUDENT_ATTENDANCE}
            />
            <NavTab
              icon={<FiMessageSquare />}
              label={msg.tabs.messages}
              value={CurrentTab.MESSAGES}
            />
            <NavTab
              icon={<IoIosSettings />}
              label={msg.tabs.settings}
              value={CurrentTab.STUDENT_SETTINGS}
            />
          </>
        )}
      </nav>
    </>
  );

  return (
    <div className="flex bg-slate-200">
      {mobileExpanded && (
        <TransparentCover onClick={() => setMobileExpanded(false)} />
      )}

      <AnimatePresence mode="wait">
        {mobileExpanded && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "keyframes", stiffness: 300 }}
            className="fixed left-0 top-0 z-50 h-screen w-full bg-gray-800 text-white md:hidden"
          >
            {NavContents}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="z-50 hidden h-screen w-64 bg-gray-800 text-white md:block">
        {NavContents}
      </div>

      <div className={`flex-1 ${mobileExpanded ? "overflow-hidden" : ""}`}>
        <div className="flex h-screen flex-col">
          <div className="flex flex-row items-center justify-end bg-slate-200 pr-3 shadow-xl">
            <Logo className="ml-4" />
            <div className="flex flex-row items-center justify-center gap-2">
              <LanguageSwitcher imageClasses="w-8 rounded-full border-gray-300 border-4" />
            </div>
            <div className="mx-2 block h-14 w-1 rounded-full bg-gray-300"></div>
            <div className="relative inline-block text-left">
              <img
                src={userAvatar()}
                alt="Avatar"
                className="aspect-square size-8 cursor-pointer rounded-full border-4 border-gray-300 object-cover"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              />
              <div
                className={`${userDropdownOpen ? "absolute" : "hidden"} right-0 z-20 mt-6 w-56 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none`}
              >
                <div className="py-1" role="none">
                  <span
                    className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      pb.authStore.clear();
                      navigate(teacherPanel ? "/teacher-login" : "/login");
                    }}
                  >
                    {msg.universal.logout}
                  </span>
                </div>
              </div>
            </div>
            <MobileExpander className="ml-3 bg-gray-800" />
          </div>

          <div className="overflow-y-auto p-6">
            {/* Student */}
            {currentTab === CurrentTab.STUDENT_HOME && <StudentHomeTab />}
            {currentTab === CurrentTab.STUDENT_TIMETABLE && (
              <StudentTimetableTab />
            )}
            {currentTab === CurrentTab.STUDENT_GRADES && <StudentGradesTab />}
            {currentTab === CurrentTab.STUDENT_TESTS && <StudentTestsTab />}
            {currentTab === CurrentTab.STUDENT_HOMEWORK && (
              <StudentHomeworkTab />
            )}
            {currentTab === CurrentTab.STUDENT_ATTENDANCE && (
              <StudentAttendaceTab />
            )}
            {currentTab === CurrentTab.STUDENT_MESSAGES && (
              <StudentMessagesTab />
            )}
            {currentTab === CurrentTab.STUDENT_SETTINGS && (
              <StudentSettingsTab />
            )}

            {/* Teacher */}
            {currentTab === CurrentTab.TEACHER_HOME && <TeacherHomeTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
