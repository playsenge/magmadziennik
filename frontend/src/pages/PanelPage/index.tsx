import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pb } from "../../database/pocketbase";
import { UserGeneric } from "../../database/interfaces";
import { msg } from "../../language";
import { LuCalendarDays } from "react-icons/lu";
import { FiMessageSquare } from "react-icons/fi";
import { IoIosCheckmarkCircleOutline, IoIosSettings } from "react-icons/io";
import { RiFilePaper2Line } from "react-icons/ri";
import { FaBars, FaHamburger, FaPenFancy } from "react-icons/fa";
import { FaListCheck, FaMobileScreenButton } from "react-icons/fa6";
import { AiOutlineAppstore } from "react-icons/ai";

import HomeTab from "./tabs/HomeTab";
import TimetableTab from "./tabs/TimeTableTab";
import GradesTab from "./tabs/GradesTab";
import TestsTab from "./tabs/TestsTab";
import HomeworkTab from "./tabs/HomeworkTab";
import AttendaceTab from "./tabs/AttendanceTab";
import MessagesTab from "./tabs/MessagesTab";
import SettingsTab from "./tabs/SettingsTab";
import React from "react";

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

  const NavTab = ({
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
        value === currentTab
          ? "bg-gray-700"
          : "cursor-pointer hover:bg-gray-600"
      }
      onClick={() => setCurrentTab(value)}
    >
      {React.cloneElement(icon, { className: "me-2 inline text-2xl" })}
      {label}
    </span>
  );

  const MobileExpander = ({ className }: { className: string }) => (
    <button
      id="menuBtn"
      className={`block rounded p-2 text-white md:hidden ${className}`}
      onClick={() => setMobileExpanded(!mobileExpanded)}
    >
      <FaBars />
    </button>
  );

  return (
    <div>
      <div className="flex">
        <div
          className={`${mobileExpanded ? "block w-full" : "hidden"} h-screen bg-gray-800 text-white md:block md:w-64`}
        >
          <MobileExpander className="absolute right-5 top-5 bg-gray-700" />
          <div className="flex items-center p-4 text-lg font-bold">
            {getTimeOfDay()}, {user.first_name}
          </div>
          <nav className="*:block *:rounded *:px-4 *:py-2.5">
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
        </div>
        <div className={`flex-1 p-6 ${mobileExpanded ? "hidden" : ""}`}>
          <MobileExpander className="absolute right-5 top-5 bg-gray-800" />

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
    </div>
  );
}
