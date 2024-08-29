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

export interface Student {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    address: string;
    phone_number: string;
    avatar: string;
    created: Date;
    updated: Date;
}

export interface Teacher {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    avatar: string;
    subjects: string[];
    created: Date;
    updated: Date;
}

export interface Subject {
    id: string;
    name: string;
    shorthand: string; // Shortened name for subject aka "IT" instead of "Information Technology"
    created: Date;
    updated: Date;
}