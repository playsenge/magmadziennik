import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import Footer, { beforeFooterStyle } from "../components/footer";
import { login, pb } from "../database/pocketbase";
import { LoginResult } from "../database/enums";
import LoadingSpinner from "../components/loading-spinner";
import { msg } from "../language";

export default function LoginPage() {
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const [error, setError] = useState(LoginResult.SUCCESS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pb.authStore.isValid) {
      navigate("/panel");
    }
  }, [navigate]);

  if (pb.authStore.isValid) return null;

  const getErrorMessage = () => {
    switch (error) {
      case LoginResult.INCORRECT_EMAIL_OR_PASSWORD:
        return msg.login_page.incorrect_email_or_password;
      case LoginResult.UNIDENTIFIED_ERROR:
        return msg.login_page.server_side_error;
      default:
        return "";
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-center"
        style={beforeFooterStyle}
      >
        <form className="flex flex-col items-center justify-center gap-5 rounded-xl bg-gray-700 p-12 text-white shadow-xl shadow-slate-800">
          <h1 className="mb-4 text-4xl font-bold">{msg.universal.login}</h1>
          {error !== LoginResult.SUCCESS && (
            <p className="mb-2 text-red-600">{getErrorMessage()}</p>
          )}
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
            placeholder={msg.universal.password}
            ref={passwordInput}
            icon={<FaLock />}
            minLength={8}
            name="password"
          />
          <Link to="/forgot-password" className="underline">
            {msg.login_page.forgot_password}
          </Link>
          <Button
            type="submit"
            disabled={loading}
            onClick={async (e) => {
              e.preventDefault();

              if (!emailInput.current || !passwordInput.current) return;

              const email = emailInput.current.value;
              const password = passwordInput.current.value;

              setLoading(true);
              setError(LoginResult.SUCCESS);

              const result = await login(email, password);

              switch (result) {
                case LoginResult.SUCCESS:
                  navigate("/panel");
                  break;
                default:
                  setError(result);
                  break;
              }

              setLoading(false);
            }}
          >
            {loading ? <LoadingSpinner /> : msg.universal.login}
          </Button>
        </form>
      </div>
      <Footer />
    </>
  );
}
