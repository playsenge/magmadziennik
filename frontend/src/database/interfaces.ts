// Interfaces to match PocketBase SQLite DB schema

export interface UserGeneric {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    avatar: string;
    created: Date;
    updated: Date;
}

export interface Student extends UserGeneric {
    class: SchoolClass;
    date_of_birth: Date;
    address: string;
}

export interface Teacher extends UserGeneric {
    admin: boolean;
    subjects: string[];
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
    student: Student;
    semester: number;
    created: Date;
    updated: Date;
}

export interface SchoolClass {
    id: string;
    name: string;
    students: Student[];
    teacher_subject_pairs: TeacherSubjectPair;
    created: Date;
    updated: Date;
}

export interface TeacherSubjectPair {
    teacher: Teacher;
    authorized_subjects: Subject[];
}