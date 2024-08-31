import { RecordModel } from "pocketbase";
import { Grade } from "../interfaces";
import { config } from "../../config";
import StudentBuilder from "./StudentBuilder";

export default (data: RecordModel[]): Grade[] => {
    return data.map((data) => ({
        ...data,
        grade: config.grades[data.gradeID],
        student: StudentBuilder(data.expand?.student),
        created: new Date(data.created),
        updated: new Date(data.updated),
    })) as unknown as Grade[];
};