import { RecordModel } from "pocketbase";
import { SchoolClass } from "../interfaces";

export default (data: RecordModel[]): SchoolClass[] => {
    return data.map((data) => ({
        ...data,
        created: new Date(data.created),
        updated: new Date(data.updated),
    })) as unknown as SchoolClass[];
}

// 100% - 31.08.2024