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
    date_of_birth: Date;
    address: string;
    phone_number: string;
    created: Date;
    updated: Date;
}

export type Student = UserGeneric;

export interface Teacher extends UserGeneric {
    admin: boolean;
}

export interface Guardian extends UserGeneric {
    mentees_ids: string[];
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
    class: SchoolClass;
    semester: number;
    weight: number;
    created: Date;
    updated: Date;
}

export interface EditedGrade extends GradeModel {
    student: string;
    column: string;
}

export interface SchoolClass {
    id: string;
    name: string;
    semester: number;
    teacher_subject_pairs: Record<string, string[]>;
    created: Date;
    updated: Date;
}

export interface Timeframe {
    id: string;
    since_midnight_seconds: number;
    length: number;
    created: Date;
    updated: Date;
}

export interface Room {
    id: string;
    display: string;
    created: Date;
    updated: Date;
}


export interface UnparsedTimetableEntry {
    room: string;
    subject: string;
    teacher: string;
    timeframe: string;
}

export interface TimetableEntry {
    room: Room;
    subject: Subject;
    teacher: Teacher;
    timeframe: Timeframe;
}

export interface Timetable {
    id: string;
    entries: Record<number, TimetableEntry[]>;
    created: Date;
    updated: Date;
}
