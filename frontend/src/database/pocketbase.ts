import PocketBase, { ClientResponseError } from "pocketbase";
import { Grade, Room, Student, Subject, Teacher, Timeframe, Timetable, UnparsedTimetableEntry, UserGeneric } from "./interfaces";
import { LoginResult } from "./enums";
import { devMsg } from "../utils";
import { config } from "../config";
import SubjectBuilder from "./builders/SubjectBuilder";
import GradeBuilder from "./builders/GradeBuilder";
import RoomBuilder from "./builders/RoomBuilder";
import TeacherBuilder from "./builders/TeacherBuilder";
import TimeframeBuilder from "./builders/TimeframeBuilder";
import TimetableBuilder from "./builders/TimetableBuilder";

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
        expand: "student,subject,teacher,class",
        sort: "-created",
    }));
};

export const getSingleGrade = async (id: string): Promise<Grade | undefined> => {
    if (!pb.authStore.isValid) return undefined;

    return GradeBuilder([await pb.collection("grades").getOne(id, {
        expand: "student,subject,teacher,class",
    })])[0];
};

export const getRooms = async (ids: string[]): Promise<Room[] | undefined> => {
    if (!pb.authStore.isValid) return undefined;

    return RoomBuilder(await pb.collection("rooms").getFullList({
        filter: ids.map((id: string) => `id='${id}'`).join("||"),
        requestKey: null
    }));
}

export const getSubjectsSpecific = async (ids: string[]): Promise<Subject[] | undefined> => {
    if (!pb.authStore.isValid) return undefined;

    return SubjectBuilder(await pb.collection("subjects").getFullList({
        filter: ids.map((id: string) => `id='${id}'`).join("||"),
        requestKey: null
    }));
}

export const getTeachers = async (ids: string[]): Promise<Teacher[] | undefined> => {
    if (!pb.authStore.isValid) return undefined;

    return TeacherBuilder(await pb.collection("teachers").getFullList({
        filter: ids.map((id: string) => `id='${id}'`).join("||"),
        requestKey: null
    }));
}

export const getTimeframes = async (ids: string[]): Promise<Timeframe[] | undefined> => {
    if (!pb.authStore.isValid) return undefined;

    return TimeframeBuilder(await pb.collection("timeframes").getFullList({
        filter: ids.map((id: string) => `id='${id}'`).join("||"),
        requestKey: null
    }));
}

export const getTimetable = async (date: Date): Promise<Timetable[] | undefined> => {
    if (!pb.authStore.isValid) return undefined;

    const response = await pb.collection("timetables").getFullList({
        filter: `starting <= '${date.toISOString()}' && ending >= '${date.toISOString()}'`,
        sort: "-ending",
    });

    const timetables = [];

    const rooms: Record<string, Room> = {};
    const subjects: Record<string, Subject> = {};
    const teachers: Record<string, Teacher> = {};
    const timeframes: Record<string, Timeframe> = {};

    const roomIds = new Set<string>();
    const subjectIds = new Set<string>();
    const teacherIds = new Set<string>();
    const timeframeIds = new Set<string>();

    for (const item of response) {
        item.data.forEach((x: UnparsedTimetableEntry[]) =>
            x.forEach((y: UnparsedTimetableEntry) => {
                roomIds.add(y.room);
                subjectIds.add(y.subject);
                teacherIds.add(y.teacher);
                timeframeIds.add(y.timeframe);
            })
        );

        const [roomsArray, subjectsArray, teachersArray, timeframesArray] = await Promise.all([
            getRooms(Array.from(roomIds)),
            getSubjectsSpecific(Array.from(subjectIds)),
            getTeachers(Array.from(teacherIds)),
            getTimeframes(Array.from(timeframeIds)),
        ]);

        (roomsArray ?? []).forEach(room => {
            rooms[room.id] = room;
        });

        (subjectsArray ?? []).forEach(subject => {
            subjects[subject.id] = subject;
        });

        (teachersArray ?? []).forEach(teacher => {
            teachers[teacher.id] = teacher;
        });

        (timeframesArray ?? []).forEach(timeframe => {
            timeframes[timeframe.id] = timeframe;
        });

        timetables.push(TimetableBuilder(item, rooms, subjects, teachers, timeframes));
    }

    return timetables;
};