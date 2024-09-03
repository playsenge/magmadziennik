import { RecordModel } from "pocketbase";
import { SchoolClass, TeacherSubjectPair } from "../interfaces";

export default (data: RecordModel[]): SchoolClass[] => {
    return data.map((data) => ({
        ...data,
        student_ids: data.students,
        teacher_subject_pairs: data.teacher_subject_pairs as TeacherSubjectPair[] || [],
        created: new Date(data.created),
        updated: new Date(data.updated),
    })) as unknown as SchoolClass[];
}

// 100% - 31.08.2024