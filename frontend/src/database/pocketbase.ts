import PocketBase, { ClientResponseError } from "pocketbase";
import { Student, Subject, Teacher, UserGeneric } from "./interfaces";
import { LoginResult } from "./enums";
import { devMsg } from "../utils";

export const pb = new PocketBase(
    "https://magmapb.senge1337.cc"
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
    try {
        const subjects = await pb.collection("subjects").getFullList({
            requestKey: "getSubjects",
        });

        return subjects.map((subject) => ({
            ...subject,
            created: new Date(subject.created),
            updated: new Date(subject.updated),
        })) as unknown as Subject[];
    } catch {
        return [];
    }
};

export const getSubjectsForStudent = async (): Promise<Subject[]> => {
    try {
        const subjectIds = pb.authStore!.model!.subjects ?? [];
        if (subjectIds.length <= 0) return [];

        const subjects = await pb.collection("subjects").getFullList({
            filter: subjectIds.map((id: string) => `id='${id}'`).join("||"),
            requestKey: "getSubjectsForStudent",
        });

        return subjects.map((subject) => ({
            ...subject,
            created: new Date(subject.created),
            updated: new Date(subject.updated),
        })) as unknown as Subject[];
    } catch {
        return [];
    }
};