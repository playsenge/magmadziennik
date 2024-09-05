import { useQuery } from "react-query";
import { getClasses } from "../../../../../../database/pocketbase";
import { msg } from "../../../../../../language";
import { IoInformationCircleSharp } from "react-icons/io5";
import LoadingSpinner from "../../../../../../components/loading-spinner";
import HoverDetail from "../../../../../../components/hover-detail";
import {
  getCachedClassStudents,
  getCachedStudent,
  getCachedSubject,
  getCachedTeacher,
} from "../../../../../../database/cache-helper";

export default function SchoolClassManager() {
  const { data, error, isLoading } = useQuery("getClasses", getClasses);

  if (isLoading || !data) return <LoadingSpinner />;
  if (error) return <p>{msg.universal.server_side_error}</p>;

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-lg bg-white text-black shadow-md dark:bg-slate-800 dark:text-white">
          <thead>
            <tr className="*:border-b-2 *:border-gray-300 *:px-4 *:py-2 *:text-left dark:*:border-gray-600">
              <th>#</th>
              <th>{msg.universal.class}</th>
              <th>{msg.universal.semester}</th>
              <th>{msg.universal.teachers}</th>
              <th>{msg.universal.students}</th>
              <th>{msg.universal.created}</th>
              <th>{msg.universal.updated}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, i) => (
              <tr
                key={entry.id}
                className="cursor-pointer *:px-4 *:py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => alert("opening edit menu idk")}
              >
                <td>{i + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.semester}</td>
                <td>
                  <div className="group inline-block">
                    <IoInformationCircleSharp />
                    <HoverDetail>
                      {Object.keys(entry.teacher_subject_pairs).map(
                        (teacher_id, index, array) => {
                          const teacher = getCachedTeacher(teacher_id);

                          return (
                            <>
                              <p key={teacher_id} className="font-bold">
                                {teacher
                                  ? `${teacher.first_name} ${teacher.last_name}`
                                  : `ID: ${teacher_id}`}
                              </p>
                              <p>
                                {entry.teacher_subject_pairs[teacher_id].map(
                                  (subject_id) => {
                                    const subject =
                                      getCachedSubject(subject_id);
                                    return (
                                      <p key={subject_id}>
                                        &middot;{" "}
                                        {subject
                                          ? subject.name
                                          : `ID: ${subject_id}`}
                                      </p>
                                    );
                                  },
                                )}
                              </p>
                              {index !== array.length - 1 && <p>&nbsp;</p>}
                            </>
                          );
                        },
                      )}
                    </HoverDetail>
                  </div>
                </td>
                <td>
                  <div className="group inline-block">
                    <IoInformationCircleSharp />
                    <HoverDetail>
                      {(getCachedClassStudents(entry.id) || []).map(
                        (student) => {
                          return (
                            <p key={student.id}>
                              {student.first_name} {student.last_name}
                            </p>
                          );
                        },
                      )}
                    </HoverDetail>
                  </div>
                </td>
                <td>{new Date(entry.created).toLocaleDateString()}</td>
                <td>{new Date(entry.updated).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
