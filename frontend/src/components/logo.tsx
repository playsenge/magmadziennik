import { memo } from "react";
import { Link } from "react-router-dom";

export function Logo({ className }: { className?: string }) {
  return (
    <Link className={`quicksand mr-auto text-3xl ${className ?? ""}`} to="/">
      MAGMA
    </Link>
  );
}

export default memo(Logo);
