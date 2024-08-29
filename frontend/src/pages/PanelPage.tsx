import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { pb } from "../database/pocketbase";
import { UserGeneric } from "../database/interfaces";
import { msg } from "../language";
import { LuCalendarDays } from "react-icons/lu";
import { FiMessageSquare } from "react-icons/fi";
import { IoIosCheckmarkCircleOutline, IoIosSettings } from "react-icons/io";
import { RiFilePaper2Line } from "react-icons/ri";
import { FaPenFancy } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { AiOutlineAppstore } from "react-icons/ai";

export default function PanelPage() {
  const navigate = useNavigate();
  const user: UserGeneric = useMemo(
    () => pb.authStore.model as UserGeneric,
    [],
  );

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

  return (
    <div>
      <div className="flex">
        <div className="hidden h-screen w-64 bg-gray-800 text-white md:block">
          <div className="p-4 text-lg font-bold">{getTimeOfDay()}, {user.first_name}</div>
          <nav className="mt-4">
            <a href="#" className="block rounded px-4 py-2.5 hover:bg-gray-700"><AiOutlineAppstore className="me-2 inline text-2xl" />Strona główna</a>
            <a href="#" className="block rounded px-4 py-2.5 hover:bg-gray-700"><LuCalendarDays className="me-2 inline text-2xl" /> Plan lekcji</a>
            <a href="#" className="block rounded px-4 py-2.5 hover:bg-gray-700"><FaListCheck className="me-2 inline text-2xl" />Oceny</a>
            <a href="#" className="block rounded px-4 py-2.5 hover:bg-gray-700"><FaPenFancy className="me-2 inline text-2xl" />Sprawdziany</a>
            <a href="#" className="block rounded px-4 py-2.5 hover:bg-gray-700"><RiFilePaper2Line className="me-2 inline text-2xl" />Zadania domowe</a>
            <a href="#" className="block rounded px-4 py-2.5 hover:bg-gray-700"><IoIosCheckmarkCircleOutline className="me-2 inline text-2xl" />Frekwencja</a>
            <a href="#" className="block rounded px-4 py-2.5 hover:bg-gray-700"><FiMessageSquare className="me-2 inline text-2xl" />Wiadomości</a>
            <a href="#" className="block rounded px-4 py-2.5 hover:bg-gray-700"><IoIosSettings className="me-2 inline text-2xl" />Ustawienia</a>
          </nav>
        </div>
        <div className="flex-1 p-6">
          <button id="menuBtn" className="rounded bg-gray-800 p-2 text-white md:hidden">Menu</button>
          <h1 className="text-2xl font-bold">Main Content</h1>
          <p className="mt-4">Here is the main content area.</p>
        </div>
      </div>
    </div>
  );
}
