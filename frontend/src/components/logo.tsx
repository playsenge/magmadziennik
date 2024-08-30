import { Link } from "react-router-dom";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link className={`quicksand mr-auto text-3xl ${className ?? ""}`} to="/">
      MAGMA
    </Link>
  );
}
