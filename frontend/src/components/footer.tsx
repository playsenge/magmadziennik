import { Link } from "react-router-dom";
import {
  availableLanguages,
  getCurrentLanguage,
  msg,
  msgAs,
  setLanguage,
} from "../language";

const height = 7;

// eslint-disable-next-line react-refresh/only-export-components
export const beforeFooterStyle: React.CSSProperties = {
  height: 100 - height + "vh",
};

export default function Footer() {
  return (
    <footer
      className={`quicksand flex items-center gap-7 bg-gray-300 px-6 text-slate-500`}
      style={{
        height: height + "vh",
      }}
    >
      <Link className="mr-auto text-3xl" to="/">
        MAGMA
      </Link>

      <Link to="/gdpr">{msg.footer.gdpr}</Link>
      <Link to="/contact">{msg.footer.contact}</Link>
      <Link to="/about-us">{msg.footer.about_us}</Link>
      <Link to="/privacy-policy">{msg.footer.privacy_policy}</Link>

      {availableLanguages.map((language) => (
        <img
          key={language}
          className={
            language != getCurrentLanguage()
              ? "cursor-pointer"
              : "cursor-default"
          }
          onClick={() =>
            language != getCurrentLanguage() && setLanguage(language)
          }
          src={`https://flagcdn.com/16x12/${msgAs(language).flag}.png`}
          alt={`Set language to ${language}`}
        />
      ))}
    </footer>
  );
}
