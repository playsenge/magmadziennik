import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import Footer, { beforeFooterStyle } from "../components/footer";
import { login, pb } from "../database/pocketbase";
import { LoginResult } from "../database/enums";
import LoadingSpinner from "../components/loading-spinner";
import { msg } from "../language";

export default function LoginPage() {
  const location = useLocation();
  const teacherLogin = useMemo(
    () => location.pathname.slice(1) === "teacher-login",
    [location],
  );

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
        return msg.universal.server_side_error;
      default:
        return "";
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-center bg-gray-100 dark:bg-slate-900"
        style={beforeFooterStyle}
      >
        <form className="flex flex-col items-center justify-center gap-5 rounded-xl bg-white p-12 text-white shadow-xl shadow-gray-200 dark:bg-gray-700 dark:shadow-slate-800">
          <h1 className="mb-4 text-center text-4xl font-bold text-black dark:text-white">
            {teacherLogin
              ? msg.login_page.teacher_header
              : msg.login_page.student_header}
          </h1>
          {error !== LoginResult.SUCCESS && (
            <p className="mb-2 text-red-600">{getErrorMessage()}</p>
          )}
          <Input
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
          <Link
            to="/forgot-password"
            className="-mb-4 text-black underline dark:text-white"
          >
            {msg.login_page.forgot_password}
          </Link>
          <Link
            to={teacherLogin ? "/login" : "/teacher-login"}
            className="text-black underline dark:text-white"
          >
            {teacherLogin
              ? msg.login_page.student_login
              : msg.login_page.teacher_login}
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

              const result = await login(email, password, teacherLogin);

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
