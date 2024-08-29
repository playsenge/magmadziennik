import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="quicksand flex h-[7vh] items-center gap-7 bg-gray-300 px-6 text-slate-500">
      <Link className="text-3xl" to="/">
        MAGMA
      </Link>
      <Link className="ml-auto" to="/rodo">
        RODO
      </Link>
      <Link to="/contact">Kontakt</Link>
      <Link to="/about-us">O nas</Link>
      <Link to="/privacy-policy">Polityka prywatności</Link>
    </footer>
  );
}
