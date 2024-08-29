import {
  availableLanguages,
  getCurrentLanguage,
  msgAs,
  setLanguage,
} from "../language";

export default function LanguageSwitcher(props: { imageClasses?: string }) {
  return (
    <>
      {availableLanguages.map((language) => (
        <img
          key={language}
          className={
            (language != getCurrentLanguage()
              ? "cursor-pointer"
              : "cursor-default") +
            " " +
            (props.imageClasses ?? "")
          }
          onClick={() =>
            language != getCurrentLanguage() && setLanguage(language)
          }
          // src={`https://flagcdn.com/192x144/${msgAs(language).flag}.png`}
          src={`https://hatscripts.github.io/circle-flags/flags/${msgAs(language).flag}.svg`}
          alt={msgAs(language).name}
        />
      ))}
    </>
  );
}
