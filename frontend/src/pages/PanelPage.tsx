import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { pb } from "../database/pocketbase";
import { UserGeneric } from "../database/interfaces";

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

  return (
    <aside className="h-screen">
      <nav className="flex h-full flex-col border-r bg-slate-800 text-white shadow-sm">
        <div className="flex items-center justify-between p-4 pb-2">
          <p className="text-3xl">Dzień dobry, {user.first_name}</p>
        </div>
      </nav>
    </aside>
  );
}
