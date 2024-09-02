import { RecordModel } from "pocketbase";
import { Room, Subject, Teacher, Timeframe, Timetable, UnparsedTimetableEntry } from "../interfaces";

export default (data: RecordModel, rooms: Record<string, Room>, subjects: Record<string, Subject>, teachers: Record<string, Teacher>, timeframes: Record<string, Timeframe>): Timetable => {
    return {
        id: data.id,
        entries: data.data.map((entry: UnparsedTimetableEntry[]) => (
            entry.map((innerEntry: UnparsedTimetableEntry) => ({
                room: rooms[innerEntry.room],
                subject: subjects[innerEntry.subject],
                teacher: teachers[innerEntry.teacher],
                timeframe: timeframes[innerEntry.timeframe],
            }))
        )
        ),
        created: new Date(data.created),
        updated: new Date(data.updated),
    } as Timetable;
};
