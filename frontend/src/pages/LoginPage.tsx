import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import Footer from "../components/footer";
import { login } from "../database/pocketbase";
import { LoginResult } from "../database/enums";
import LoadingSpinner from "../components/loading-spinner";

export default function LoginPage() {
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="flex h-[93vh] items-center justify-center">
        <form className="flex flex-col items-center justify-center gap-5 rounded-xl bg-gray-700 p-12 text-white shadow-xl shadow-slate-800">
          <h1 className="text-4xl font-bold">Zaloguj się</h1>
          {error && <p className="my-2 text-red-600">{error}</p>}
          <Input
            className="bg-slate-600"
            type="email"
            placeholder="E-mail"
            ref={emailInput}
            icon={<MdOutlineAlternateEmail />}
            name="email"
          />
          <Input
            type="password"
            placeholder="Hasło"
            ref={passwordInput}
            icon={<FaLock />}
            name="password"
          />
          <Link to="/forgot-password" className="underline">
            Zapomniałeś hasła?
          </Link>
          <Button
            type="submit"
            disabled={loading}
            onClick={async (e) => {
              e.preventDefault();

              if (!emailInput.current || !passwordInput.current) return;

              setLoading(true);
              setError("");

              const email = emailInput.current.value;
              const password = passwordInput.current.value;

              const result = await login(email, password);

              switch (result) {
                case LoginResult.SUCCESS:
                  navigate("/panel");
                  break;
                case LoginResult.INCORRECT_EMAIL_OR_PASSWORD:
                  setError("Nieprawidłowy e-mail lub hasło");
                  break;
                case LoginResult.UNIDENTIFIED_ERROR:
                  setError(
                    "Wystąpił błąd po stronie serwera. I tak mamy wyższy uptime niż librus.",
                  );
                  break;
              }

              setLoading(false);
            }}
          >
            {loading ? <LoadingSpinner /> : "Zaloguj się"}
          </Button>
        </form>
      </div>
      <Footer />
    </>
  );
}
