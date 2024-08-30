import { Grade } from "./database/interfaces";
import { Language } from "./language";

export const config = {
    grades: [
        { text: "1", value: 1, weight: 1, date: new Date(2024, 9, 30, 12, 30), color: "#d64b4b" },
        { text: "1+", value: 1.33, weight: 1, date: new Date(2024, 9, 30, 12, 30), color: "#d64b4b" },
        { text: "2-", value: 1.66, weight: 1, date: new Date(2024, 9, 30, 12, 30), color: "#ff7f57" },
        { text: "2", value: 2, weight: 1, color: "#ff7f57" },
        { text: "2+", value: 2.33, weight: 1, date: new Date(2024, 9, 30, 12, 30), color: "#ff7f57" },
        { text: "3-", value: 2.66, weight: 1, date: new Date(2024, 9, 30, 12, 30), color: "#ffbd4c" },
        { text: "3", value: 3, weight: 1, date: new Date(2024, 9, 30, 12, 30), color: "#ffbd4c" },
        { text: "3+", value: 3.33, weight: 1, date: new Date(2024, 9, 30, 12, 30), color: "#ffbd4c" },
        { text: "4-", value: 3.66, weight: 1, date: new Date(2024, 9, 30, 12, 30), color: "#a6c83f" },
        { text: "4", value: 4, weight: 1, date: new Date(2024, 9, 30, 12, 30), color: "#a6c83f" },
        { text: "4+", value: 4.33, weight: 1, date: new Date(2024, 9, 30, 12, 30), color: "#a6c83f" },
        { text: "5-", value: 4.66, weight: 1, date: new Date(2024, 9, 30, 12, 30), color: "#54b358" },
        { text: "5", value: 5, weight: 1, date: new Date(2024, 9, 30, 12, 30), color: "#54b358" },
        { text: "5+", value: 5.33, weight: 1, date: new Date(2024, 9, 30, 12, 30), color: "#54b358" },
        { text: "6", value: 6, weight: 1, date: new Date(2024, 9, 30, 12, 30), color: "#4ac0f6" },
        { text: "nb", value: 0, weight: 1, date: new Date(2024, 9, 30, 12, 30), color: "#9CA3AF" },
    ] as Grade[],
    defaultLanguage: "pl" as Language,
};