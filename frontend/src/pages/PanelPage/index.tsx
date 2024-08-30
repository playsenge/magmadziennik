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

import HomeTab from "./tabs/HomeTab";
import TimetableTab from "./tabs/TimetableTab";
import GradesTab from "./tabs/GradesTab";
import TestsTab from "./tabs/TestsTab";
import HomeworkTab from "./tabs/HomeworkTab";
import AttendaceTab from "./tabs/AttendanceTab";
import MessagesTab from "./tabs/MessagesTab";
import SettingsTab from "./tabs/SettingsTab";
import React from "react";
import LanguageSwitcher from "../../components/language-switcher";
import TransparentCover from "../../components/transparent-cover";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../../components/logo";

enum CurrentTab {
  HOME,
  TIMETABLE,
  GRADES,
  TESTS,
  HOMEWORK,
  ATTENDANCE,
  MESSAGES,
  SETTINGS,
}

export default function PanelPage() {
  const navigate = useNavigate();
  const user: UserGeneric = useMemo(
    () => pb.authStore.model as UserGeneric,
    [],
  );

  const [currentTab, setCurrentTab] = useState<CurrentTab>(CurrentTab.HOME);
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
        <NavTab
          icon={<AiOutlineAppstore />}
          label={msg.tabs.home}
          value={CurrentTab.HOME}
        />
        <NavTab
          icon={<LuCalendarDays />}
          label={msg.tabs.timetable}
          value={CurrentTab.TIMETABLE}
        />
        <NavTab
          icon={<FaListCheck />}
          label={msg.tabs.grades}
          value={CurrentTab.GRADES}
        />
        <NavTab
          icon={<FaPenFancy />}
          label={msg.tabs.tests}
          value={CurrentTab.TESTS}
        />
        <NavTab
          icon={<RiFilePaper2Line />}
          label={msg.tabs.homework}
          value={CurrentTab.HOMEWORK}
        />
        <NavTab
          icon={<IoIosCheckmarkCircleOutline />}
          label={msg.tabs.attendance}
          value={CurrentTab.ATTENDANCE}
        />
        <NavTab
          icon={<FiMessageSquare />}
          label={msg.tabs.messages}
          value={CurrentTab.MESSAGES}
        />
        <NavTab
          icon={<IoIosSettings />}
          label={msg.tabs.settings}
          value={CurrentTab.SETTINGS}
        />
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

      <div className={`flex-1 p-6 ${mobileExpanded ? "overflow-hidden" : ""}`}>
        <div className="-m-6 mb-6 flex flex-row items-center justify-end bg-slate-200 pr-3 shadow-xl">
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
                    navigate("/login");
                  }}
                >
                  Wyloguj
                </span>
              </div>
            </div>
          </div>
          <MobileExpander className="ml-3 bg-gray-800" />
        </div>

        {currentTab === CurrentTab.HOME && <HomeTab />}
        {currentTab === CurrentTab.TIMETABLE && <TimetableTab />}
        {currentTab === CurrentTab.GRADES && <GradesTab />}
        {currentTab === CurrentTab.TESTS && <TestsTab />}
        {currentTab === CurrentTab.HOMEWORK && <HomeworkTab />}
        {currentTab === CurrentTab.ATTENDANCE && <AttendaceTab />}
        {currentTab === CurrentTab.MESSAGES && <MessagesTab />}
        {currentTab === CurrentTab.SETTINGS && <SettingsTab />}
      </div>
    </div>
  );
}
