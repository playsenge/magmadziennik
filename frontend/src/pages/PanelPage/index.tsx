import { memo, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import StudentSettingsTab from "./tabs/student/SettingsTab";
import StudentTestsTab from "./tabs/student/TestsTab";
import StudentTimetableTab from "./tabs/student/TimetableTab";

import TeacherHomeTab from "./tabs/teacher/HomeTab";

import MessagesTab from "./tabs/MessagesTab";

const studentTabMap: { [key: string]: JSX.Element } = {
  home: <StudentHomeTab />,
  timetable: <StudentTimetableTab />,
  grades: <StudentGradesTab />,
  tests: <StudentTestsTab />,
  homework: <StudentHomeworkTab />,
  attendance: <StudentAttendaceTab />,
  settings: <StudentSettingsTab />,
  messages: <MessagesTab />,
};

const teacherTabMap: { [key: string]: JSX.Element } = {
  home: <TeacherHomeTab />,
  timetable: <>tbd</>,
  grades: <>tbd</>,
  homework: <>tbd</>,
  messages: <MessagesTab />,
};

export default function PanelPage() {
  const navigate = useNavigate();
  const params = useParams();

  const route = useMemo(() => params.route ?? "home", [params.route]);

  const TabNotFound = useMemo(
    () => <div className="flex items-center justify-center text-4xl">404</div>,
    [],
  );

  const teacherPanel = useMemo(
    () => pb.authStore.model?.collectionName === "teachers",
    [],
  );

  const tabMap: { [key: string]: JSX.Element } = teacherPanel
    ? teacherTabMap
    : studentTabMap;

  const [currentTab, setCurrentTab] = useState(() => {
    return tabMap[route] || TabNotFound;
  });

  useEffect(() => {
    setCurrentTab(tabMap[route] || TabNotFound);
  }, [TabNotFound, route, tabMap]);

  const user: UserGeneric = useMemo(
    () => pb.authStore.model as UserGeneric,
    [],
  );

  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/login");
    }
  }, [navigate]);

  if (!pb.authStore.isValid || !user) return null;

  const getTimeOfDay = () => {
    const hours = new Date().getHours();
    if (hours >= 6 && hours < 12) return msg.greetings.morning;
    if (hours >= 12 && hours < 18) return msg.greetings.afternoon;
    return msg.greetings.evening;
  };

  const NavTab = memo(
    (params: { icon: JSX.Element; label: string; route: string }) => (
      <span
        className={
          (params.route === route
            ? "bg-gray-700"
            : "cursor-pointer hover:bg-gray-600") + " block rounded px-4 py-2.5"
        }
        onClick={() => navigate(`/panel/${params.route}`)}
      >
        {React.cloneElement(params.icon, { className: "me-2 inline text-2xl" })}
        {params.label}
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

  function getIconForRoute(route: keyof typeof tabMap): JSX.Element {
    const icons: { [key: keyof typeof tabMap]: JSX.Element } = {
      home: <AiOutlineAppstore />,
      timetable: <LuCalendarDays />,
      grades: <FaListCheck />,
      tests: <FaPenFancy />,
      homework: <RiFilePaper2Line />,
      attendance: <IoIosCheckmarkCircleOutline />,
      settings: <IoIosSettings />,
      messages: <FiMessageSquare />,
    };
    return icons[route] || <AiOutlineAppstore />;
  }

  const NavContents = (
    <>
      <MobileExpander className="absolute right-4 top-4 bg-gray-700" />
      <div className="flex items-center p-4 text-lg font-bold">
        {getTimeOfDay()}, {user.first_name}!
      </div>

      <nav>
        {Object.keys(tabMap).map((route) => (
          <NavTab
            key={route}
            icon={getIconForRoute(route)}
            label={msg.tabs?.[route as keyof typeof msg.tabs] || route}
            route={route}
          />
        ))}
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

          <div key={msg.name} className="overflow-y-auto p-6">
            {currentTab}
          </div>
        </div>
      </div>
    </div>
  );
}
