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
import { getCache, setCache } from "./cache";

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
    const key = "getSubjects";

    const cachedData = getCache<Subject[]>(key);
    if (cachedData) return cachedData;

    const data = SubjectBuilder(await pb.collection("subjects").getFullList({
        requestKey: key
    }));

    setCache(key, data);

    return data;
};

export const getSubjectsForStudent = async (): Promise<Subject[]> => {
    const subjectIds = pb.authStore!.model!.subjects ?? [];
    if (subjectIds.length <= 0) return [];

    const key = "getSubjectsForStudent";

    const cachedData = getCache<Subject[]>(key);
    if (cachedData) return cachedData;

    const data = SubjectBuilder(await pb.collection("subjects").getFullList({
        // TODO: potentially refactor into queried parameter with pb.filter()??? (shouldn't cause SQL injection tho, it's sanitized server-side)
        filter: subjectIds.map((id: string) => `id='${id}'`).join("||"),
        requestKey: key
    }));

    setCache(key, data);

    return data;
};

export const getStudentGrades = async (): Promise<Grade[]> => {
    if (!pb.authStore.isValid) return [];

    const key = "getStudentGrades";

    const cachedData = getCache<Grade[]>(key);
    if (cachedData) return cachedData;

    const data = GradeBuilder(await pb.collection("grades").getFullList({
        expand: "student,subject,teacher,class",
        sort: "-created",
    }));

    setCache(key, data);

    return data;
};

export const getSingleGrade = async (id: string): Promise<Grade | undefined> => {
    if (!pb.authStore.isValid) return undefined;

    const key = `getGrade-${id}`;

    const cachedData = getCache<Grade>(key);
    if (cachedData) return cachedData;

    const data = GradeBuilder([await pb.collection("grades").getOne(id, {
        expand: "student,subject,teacher,class",
        requestKey: key
    })])[0];

    setCache(key, data);

    return data;
};

export const getRooms = async (ids: string[]): Promise<Room[] | undefined> => {
    if (!pb.authStore.isValid) return undefined;

    const cachedRooms: Room[] = [];
    const idsToFetch: string[] = [];

    for (const id of ids) {
        const cacheKey = `getRoom-${id}`;
        const cachedRoom = getCache<Room>(cacheKey);
        if (cachedRoom) {
            cachedRooms.push(cachedRoom);
        } else {
            idsToFetch.push(id);
        }
    }

    let fetchedRooms: Room[] = [];
    if (idsToFetch.length > 0) {
        fetchedRooms = await RoomBuilder(await pb.collection("rooms").getFullList({
            filter: idsToFetch.map(id => `id='${id}'`).join("||"),
            requestKey: null,
        }));

        for (const room of fetchedRooms) {
            const cacheKey = `getRoom-${room.id}`;
            setCache(cacheKey, room);
        }
    }

    return [...cachedRooms, ...fetchedRooms];
};

export const getSubjectsSpecific = async (ids: string[]): Promise<Subject[] | undefined> => {
    if (!pb.authStore.isValid) return undefined;

    const cachedSubjects: Subject[] = [];
    const idsToFetch: string[] = [];

    for (const id of ids) {
        const cacheKey = `getSubject-${id}`;
        const cachedSubject = getCache<Subject>(cacheKey);
        if (cachedSubject) {
            cachedSubjects.push(cachedSubject);
        } else {
            idsToFetch.push(id);
        }
    }

    let fetchedSubjects: Subject[] = [];
    if (idsToFetch.length > 0) {
        fetchedSubjects = await SubjectBuilder(await pb.collection("subjects").getFullList({
            filter: idsToFetch.map(id => `id='${id}'`).join("||"),
            requestKey: null,
        }));

        for (const subject of fetchedSubjects) {
            const cacheKey = `getSubject-${subject.id}`;
            setCache(cacheKey, subject);
        }
    }

    return [...cachedSubjects, ...fetchedSubjects];
};


export const getTeachers = async (ids: string[]): Promise<Teacher[] | undefined> => {
    if (!pb.authStore.isValid) return undefined;

    const cachedTeachers: Teacher[] = [];
    const idsToFetch: string[] = [];

    for (const id of ids) {
        const cacheKey = `getTeacher-${id}`;
        const cachedTeacher = getCache<Teacher>(cacheKey);
        if (cachedTeacher) {
            cachedTeachers.push(cachedTeacher);
        } else {
            idsToFetch.push(id);
        }
    }

    let fetchedTeachers: Teacher[] = [];
    if (idsToFetch.length > 0) {
        fetchedTeachers = await TeacherBuilder(await pb.collection("teachers").getFullList({
            filter: idsToFetch.map(id => `id='${id}'`).join("||"),
            requestKey: null,
        }));

        for (const teacher of fetchedTeachers) {
            const cacheKey = `getTeacher-${teacher.id}`;
            setCache(cacheKey, teacher);
        }
    }

    return [...cachedTeachers, ...fetchedTeachers];
};

export const getTimeframes = async (ids: string[]): Promise<Timeframe[] | undefined> => {
    if (!pb.authStore.isValid) return undefined;

    const cachedTimeframes: Timeframe[] = [];
    const idsToFetch: string[] = [];

    for (const id of ids) {
        const cacheKey = `getTimeframe-${id}`;
        const cachedTimeframe = getCache<Timeframe>(cacheKey);
        if (cachedTimeframe) {
            cachedTimeframes.push(cachedTimeframe);
        } else {
            idsToFetch.push(id);
        }
    }

    let fetchedTimeframes: Timeframe[] = [];
    if (idsToFetch.length > 0) {
        fetchedTimeframes = await TimeframeBuilder(await pb.collection("timeframes").getFullList({
            filter: idsToFetch.map(id => `id='${id}'`).join("||"),
            requestKey: null,
        }));

        for (const timeframe of fetchedTimeframes) {
            const cacheKey = `getTimeframe-${timeframe.id}`;
            setCache(cacheKey, timeframe);
        }
    }

    return [...cachedTimeframes, ...fetchedTimeframes];
};

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