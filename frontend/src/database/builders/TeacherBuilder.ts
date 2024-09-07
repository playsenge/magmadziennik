import { RecordModel } from "pocketbase";
import { Teacher } from "../interfaces";

export default (data: RecordModel[]): Teacher[] => {
    return data.map((data) => ({
        ...data,
        date_of_birth: new Date(data.date_of_birth),
        created: new Date(data.created),
        updated: new Date(data.updated),
    })) as unknown as Teacher[];
}