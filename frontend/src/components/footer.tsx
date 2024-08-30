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
  return (
    <footer
      className={`quicksand z-50 flex items-center gap-7 bg-gray-300 px-6 text-slate-500`}
      style={{
        height: height + "vh",
      }}
    >
      <Logo />

      <Link to="/gdpr">{msg.footer.gdpr}</Link>
      <Link to="/contact">{msg.footer.contact}</Link>
      <Link to="/about-us">{msg.footer.about_us}</Link>
      <Link to="/privacy-policy">{msg.footer.privacy_policy}</Link>

      <LanguageSwitcher imageClasses="size-5" />
    </footer>
  );
}
