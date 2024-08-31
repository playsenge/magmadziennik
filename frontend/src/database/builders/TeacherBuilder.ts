import { RecordModel } from "pocketbase";
import { Teacher } from "../interfaces";

export default (data: RecordModel[]): Teacher[] => {
    return data.map((data) => ({
        ...data,
        subject_ids: data.subjects,
        created: new Date(data.created),
        updated: new Date(data.updated),
    })) as unknown as Teacher[];
}