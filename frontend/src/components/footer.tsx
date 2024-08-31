import { Link } from "react-router-dom";
import { msg } from "../language";
import LanguageSwitcher from "./language-switcher";
import Logo from "./logo";

const height = 7;

// eslint-disable-next-line react-refresh/only-export-components
export const beforeFooterStyle: React.CSSProperties = {
  height: 100 - height + "vh",
};

export default function Footer() {
  const Links = (
    <>
      <Link to="/gdpr">{msg.footer.gdpr}</Link>
      <Link to="/contact">{msg.footer.contact}</Link>
      <Link to="/about-us">{msg.footer.about_us}</Link>
      <Link to="/privacy-policy">{msg.footer.privacy_policy}</Link>
    </>
  );

  return (
    <footer
      className="quicksand z-50 text-slate-600 *:*:*:bg-gray-200 dark:bg-gray-700 dark:text-slate-500 *:*:*:dark:bg-gray-700 *:dark:text-gray-200"
      style={{
        height: height + "vh",
      }}
    >
      {/* Desktop Version */}
      <div className="hidden h-full items-center justify-between px-6 md:flex">
        <div className="flex grow items-center gap-7">
          <Logo className="mr-auto" />
          <nav className="mr-5 flex gap-5">{Links}</nav>
        </div>
        <div className="flex items-center gap-5">
          <LanguageSwitcher imageClasses="size-5" />
        </div>
      </div>

      {/* Mobile Version */}
      <div className="flex h-full flex-col items-center md:hidden">
        <div className="flex size-full flex-col justify-between">
          <div className="flex justify-center py-3">
            <Logo />
          </div>
          <nav className="flex w-full flex-col gap-3 pt-3 text-center">
            {Links}
          </nav>
          <div className="flex items-center justify-center gap-5 py-6">
            <LanguageSwitcher imageClasses="size-5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
