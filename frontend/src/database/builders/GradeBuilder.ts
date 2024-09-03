import { RecordModel } from "pocketbase";
import { Grade } from "../interfaces";
import { config } from "../../config";
import StudentBuilder from "./StudentBuilder";
import SubjectBuilder from "./SubjectBuilder";
import TeacherBuilder from "./TeacherBuilder";
import ClassBuilder from "./ClassBuilder";

export default (data: RecordModel[]): Grade[] => {
    return data.map((data) => ({
        ...data,
        grade: config.grades.find((grade) => grade.text === data.gradeID) || config.undefinedGrade,
        teacher: TeacherBuilder([data.expand?.teacher])[0],
        subject: SubjectBuilder([data.expand?.subject])[0],
        student: StudentBuilder([data.expand?.student])[0],
        class: ClassBuilder([data.expand?.class])[0],
        created: new Date(data.created),
        updated: new Date(data.updated),
    })) as unknown as Grade[];
};

// 100% - 31.08.2024