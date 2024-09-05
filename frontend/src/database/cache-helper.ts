import { getCache } from "./cache";
import { Student, Subject, Teacher } from "./interfaces";

export function getCachedTeacher(id: string): Teacher | undefined {
    return getCache(
        `getTeacher-${id}`,
    ) as Teacher | undefined;
}

export function getCachedStudent(id: string): Student | undefined {
    return getCache(
        `getStudent-${id}`,
    ) as Student | undefined;
}

export function getCachedSubject(id: string): Subject | undefined {
    const subjects = getCache(
        `getSubjects`,
    ) as Subject[] | undefined;

    if (!subjects) return undefined;

    return subjects.find(s => s.id === id);
}

export function getCachedClassStudents(id: string): Student[] | undefined {
    return getCache(
        `getClassStudents-${id}`,
    ) as Student[] | undefined;
}