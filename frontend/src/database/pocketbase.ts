import PocketBase, { ClientResponseError } from "pocketbase";
import { Grade, Student, Subject, Teacher, UserGeneric } from "./interfaces";
import { LoginResult } from "./enums";
import { devMsg } from "../utils";
import { config } from "../config";
import SubjectBuilder from "./builders/SubjectBuilder";
import GradeBuilder from "./builders/GradeBuilder";

export const pb = new PocketBase(
    config.pocketbaseURL
);

pb.authStore.onChange(() => {
    devMsg(pb.authStore.isValid ? "Logged into @" + pb.authStore!.model!.username : "Logged out");
});

export const getAvatarUrl = (user: Student | Teacher | UserGeneric) => {
    if (!user.avatar)
        return `https://api.dicebear.com/9.x/identicon/svg?seed=${user.id}&backgroundColor=ffffff`;
    return pb.files.getUrl(user ?? {}, user?.avatar ?? "");
};

export const userAvatar = () => {
    return getAvatarUrl(pb.authStore?.model as UserGeneric);
};

export const formatUsername = (username: string) => {
    return username.replace(/[^0-9A-Za-z_-]/g, "");
};

export const login = async (email: string, password: string, teacher?: boolean): Promise<LoginResult> => {
    try {
        await pb.collection(teacher ? "teachers" : "students").authWithPassword(email, password);
    } catch (e) {
        if (e instanceof ClientResponseError) {
            if (e.status === 400) {  // Check for the status code instead of response.code
                return LoginResult.INCORRECT_EMAIL_OR_PASSWORD;
            }
        }
        return LoginResult.UNIDENTIFIED_ERROR;
    }

    return LoginResult.SUCCESS;
};

export const getSubjects = async (): Promise<Subject[]> => {
    return SubjectBuilder(await pb.collection("subjects").getFullList({
        requestKey: "getSubjects",
    }));
};

export const getSubjectsForStudent = async (): Promise<Subject[]> => {
    const subjectIds = pb.authStore!.model!.subjects ?? [];
    if (subjectIds.length <= 0) return [];

    return SubjectBuilder(await pb.collection("subjects").getFullList({
        // TODO: potentially refactor into queried parameter with pb.filter()??? (shouldn't cause SQL injection tho, it's sanitized server-side)
        filter: subjectIds.map((id: string) => `id='${id}'`).join("||"),
        requestKey: "getSubjectsForStudent",
    }));
};

export const getStudentGrades = async (): Promise<Grade[]> => {
    if (!pb.authStore.isValid) return [];

    return GradeBuilder(await pb.collection("grades").getFullList({
        expand: "student,subject,teacher",
        sort: "-created",
    }));
};

export const getSingleGrade = async (id: string): Promise<Grade | undefined> => {
    if (!pb.authStore.isValid) return undefined;

    return GradeBuilder([await pb.collection("grades").getOne(id, {
        expand: "student,subject,teacher",
        sort: "-created",
    })])[0];
};