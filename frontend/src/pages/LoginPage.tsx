import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import Footer from "../components/footer";

export default function LoginPage() {
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="flex h-[93vh] items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-5 rounded-xl bg-gray-700 p-12 text-white shadow-xl shadow-slate-800">
          <h1 className="text-4xl font-bold">Zaloguj się</h1>
          <Input
            className="bg-slate-600"
            type="email"
            placeholder="E-mail"
            ref={emailInput}
            icon={<MdOutlineAlternateEmail />}
          />
          <Input
            type="password"
            placeholder="Hasło"
            ref={passwordInput}
            icon={<FaLock />}
          />
          <Link to="/forgot-password" className="underline">
            Zapomniałeś hasła?
          </Link>
          <Button
            onClick={() => {
              if (!emailInput.current || !passwordInput.current) return;

              const email = emailInput.current.value;
              const password = passwordInput.current.value;
              alert(`email: ${email}`);
            }}
          >
            Zaloguj się
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}
