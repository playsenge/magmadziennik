import { GradeModel } from "./database/interfaces";
import { Language } from "./language";

export const config = {
    grades: [
        // baka to nie jest ffs baza danych
        // tutaj to tylko są TEMPLATE'Y JAKIE SA OCENY
        // w bazie danych będą wagi itp.
        // nie ruszaj
        { text: "1", value: 1, color: "#d64b4b" },
        { text: "1+", value: 1.33, color: "#d64b4b" },
        { text: "2-", value: 1.66, color: "#ff7f57" },
        { text: "2", value: 2, color: "#ff7f57" },
        { text: "2+", value: 2.33, color: "#ff7f57" },
        { text: "3-", value: 2.66, color: "#ffbd4c" },
        { text: "3", value: 3, color: "#ffbd4c" },
        { text: "3+", value: 3.33, color: "#ffbd4c" },
        { text: "4-", value: 3.66, color: "#a6c83f" },
        { text: "4", value: 4, color: "#a6c83f" },
        { text: "4+", value: 4.33, color: "#a6c83f" },
        { text: "5-", value: 4.66, color: "#54b358" },
        { text: "5", value: 5, color: "#54b358" },
        { text: "5+", value: 5.33, color: "#54b358" },
        { text: "6", value: 6, color: "#4ac0f6" },
        { text: "nb", value: 0, color: "#9CA3AF" },
    ] as GradeModel[],
    defaultLanguage: "pl" as Language,
};