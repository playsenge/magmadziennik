import { RecordModel } from "pocketbase";
import { Subject } from "../interfaces";

export default (data: RecordModel[]): Subject[] => {
    return data.map((data) => ({
        ...data,
        created: new Date(data.created),
        updated: new Date(data.updated),
    })) as unknown as Subject[];
};