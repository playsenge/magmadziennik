import { useEffect } from "react";
import { pb } from "../database/pocketbase";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    pb.authStore.clear();
    navigate("/login");
  }, [navigate]);

  return null;
}
