// Interfaces to match PocketBase SQLite DB schema

// Some might have slight changes and builders are made to reflect data from
// the database, including expands on queries into these functional interfaces.
// Some might contain IDs as a performance fallback to avoid unnecessary fetches
// for every single entry, which will require pb.collection("...").getOne() later.

export interface UserGeneric {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
    created: Date;
    updated: Date;
}

export interface Student extends UserGeneric {
    phone_number: string;
    class_id: string;
    date_of_birth: Date;
    address: string;
}

export interface Teacher extends UserGeneric {
    admin: boolean;
    subject_ids: string[];
}

export interface Subject {
    id: string;
    name: string;
    shorthand: string; // Shortened name for subject aka "IT" instead of "Information Technology"
    created: Date;
    updated: Date;
}

export interface GradeModel {
    text: string;
    value: number;
    color: string;
}

export interface Grade {
    id: string;
    grade: GradeModel;
    teacher: Teacher;
    student: Student;
    subject: Subject;
    semester: number;
    weight: number;
    created: Date;
    updated: Date;
}

export interface SchoolClass {
    id: string;
    name: string;
    student_ids: string[];
    teacher_subject_pairs: TeacherSubjectPair;
    created: Date;
    updated: Date;
}

export interface TeacherSubjectPair {
    teacher: Teacher;
    authorized_subjects: Subject[];
}