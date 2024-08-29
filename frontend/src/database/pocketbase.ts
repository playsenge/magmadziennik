import PocketBase, { ClientResponseError } from "pocketbase";
import { useEffect, useState } from "react";
import { Student, Teacher, UserGeneric } from "./interfaces";
import { LoginResult } from "./enums";

export const pb = new PocketBase(
    "https://magmapb.senge1337.cc"
);

export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(pb.authStore.isValid);
    const authChangeHandler = () => {
        if (import.meta.env.DEV) console.log(`New auth store: ${pb.authStore.isValid}`);
        setIsLoggedIn(pb.authStore.isValid);
    };

    useEffect(() => {
        pb.authStore.onChange(authChangeHandler);
    }, []);

    return isLoggedIn;
}

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

// export const getSubjects = () => {
//     await pb.collection("subjects").getFullList();
// };

// export const getSubjectsForStudent = () => {

// };