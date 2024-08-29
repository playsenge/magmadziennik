import { useEffect } from "react";
import { pb } from "../database/pocketbase";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(pb.authStore.isValid ? "/panel" : "/login");
  }, [navigate]);

  return null;
}
