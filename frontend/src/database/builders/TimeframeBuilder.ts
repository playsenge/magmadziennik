import { RecordModel } from "pocketbase";
import { Timeframe } from "../interfaces";

export default (data: RecordModel[]): Timeframe[] => {
    return data.map((data) => ({
        ...data,
        created: new Date(data.created),
        updated: new Date(data.updated),
    })) as unknown as Timeframe[];
}