import { RecordModel } from "pocketbase";
import { Room } from "../interfaces";

export default (data: RecordModel[]): Room[] => {
    return data.map((data) => ({
        ...data,
        created: new Date(data.created),
        updated: new Date(data.updated),
    })) as unknown as Room[];
}