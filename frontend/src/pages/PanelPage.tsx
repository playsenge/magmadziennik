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

  return <h1>Panel @{user.username}</h1>;
}
