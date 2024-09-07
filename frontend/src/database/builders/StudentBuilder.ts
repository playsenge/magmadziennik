import { RecordModel } from "pocketbase";
import { Student } from "../interfaces";

export default (data: RecordModel[]): Student[] => {
    return data.map((data) => ({
        ...data,
        date_of_birth: new Date(data.date_of_birth),
        created: new Date(data.created),
        updated: new Date(data.updated),
    })) as unknown as Student[];
}

// 100% - 31.08.2024