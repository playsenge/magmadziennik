import { devMsg } from "../utils";
import eventEmitter from "./event";
import translations from "./translations";

export type Language = keyof typeof translations;
export type Translations = typeof translations[Language];

const defaultLanguage: Language = "pl";
export const getCurrentLanguage = (): Language => {
    return (localStorage.getItem('language') as Language) || defaultLanguage;
};

const createMsgProxy = (language: Language) => {
    return new Proxy(translations[language], {
        get(target, prop) {
            return target[prop as keyof Translations] || `Missing translation for ${prop as string}`;
        },
    });
};

let msg = createMsgProxy(getCurrentLanguage());

export const setLanguage = (language: Language) => {
    localStorage.setItem('language', language);
    msg = createMsgProxy(language);

    devMsg(`localStorage.setItem('language', '${language}');`);

    eventEmitter.emit('rerender');
};

export const msgAs = (language: Language) => {
    return createMsgProxy(language);
};

export const availableLanguages: Language[] = Object.keys(translations) as Language[];

export { msg };