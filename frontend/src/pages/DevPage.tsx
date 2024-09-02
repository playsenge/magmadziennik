import {
  getStudentGrades,
  getSubjects,
  getSubjectsForStudent,
  getTimetable,
  login,
  pb,
} from "../database/pocketbase";
import { Button } from "../components/ui/button";
import { useRerender } from "../components/hooks/rerender";
import LoadingSpinner from "../components/loading-spinner";
import { devMsg } from "../utils";
import { availableLanguages, msg, msgAs, setLanguage } from "../language";
import GradeTile from "../components/grade-tile";
import { useQuery } from "react-query";

export default function DevPage() {
  const { data: subjects, error: subjectsError } = useQuery(
    "subjects",
    getSubjects,
  );
  const { data: studentSubjects, error: studentSubjectsError } = useQuery(
    "studentSubjects",
    getSubjectsForStudent,
  );
  const { data: grades, error: gradesError } = useQuery(
    "grades",
    getStudentGrades,
  );
  const { data: timetable, error: timetableError } = useQuery("timetable", () =>
    getTimetable(new Date()),
  );

  const rerender = useRerender();

  const handleClearAuth = () => {
    pb.authStore.clear();
    rerender();
  };

  const handleDemoStudentLogin = async () => {
    try {
      await login("demo@demo.com", "12345678");
      rerender();
    } catch (error) {
      devMsg("Login failed: " + error);
    }
  };

  const handleDemoTeacherLogin = async () => {
    try {
      await login("demo@demo.com", "12345678", true);
      rerender();
    } catch (error) {
      devMsg("Login failed: " + error);
    }
  };

  if (subjectsError || studentSubjectsError || gradesError || timetableError)
    return (
      <>
        <h1>{msg.universal.server_side_error}</h1>
        <pre>
          {JSON.stringify(
            { subjectsError, studentSubjectsError, gradesError },
            undefined,
            2,
          )}
        </pre>
      </>
    );
  if (!import.meta.env.DEV) return null;

  return (
    <div className="ml-4 mt-4 space-y-4">
      <h1 className="text-3xl font-bold">{msg.dev_page.title}</h1>

      <section>
        <h2 className="text-xl font-semibold">{msg.universal.subjects}</h2>
        {subjects ? (
          <ul className="ml-6 list-disc space-y-1">
            {subjects.map((subject) => (
              <li key={subject.id} className="text-sm">
                {subject.name} ({subject.shorthand}){" "}
                <span
                  onClick={() => devMsg(JSON.stringify(subject, undefined, 2))}
                  className="cursor-pointer underline"
                >
                  {msg.dev_page.log_to_console}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <LoadingSpinner />
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold">{msg.dev_page.your_subjects}</h2>
        {studentSubjects ? (
          <ul className="ml-6 list-disc space-y-1">
            {studentSubjects.map((subject) => (
              <li key={subject.id} className="text-sm">
                {subject.name} ({subject.shorthand}){" "}
                <span
                  onClick={() => devMsg(JSON.stringify(subject, undefined, 2))}
                  className="cursor-pointer underline"
                >
                  {msg.dev_page.log_to_console}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <LoadingSpinner />
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold">{msg.universal.account}</h2>
        <pre className="rounded border bg-gray-100 p-2">
          {JSON.stringify(pb.authStore.model ?? "null", null, 2)}
        </pre>
      </section>

      <section className="flex gap-4">
        <Button onClick={handleDemoStudentLogin} variant="secondary">
          S: {msg.dev_page.login_as_demo}
        </Button>
        <Button onClick={handleDemoTeacherLogin} variant="secondary">
          T: {msg.dev_page.login_as_demo}
        </Button>
        <Button onClick={handleClearAuth} variant="destructive">
          {msg.universal.logout}
        </Button>
      </section>

      <section className="flex gap-4">
        {availableLanguages.map((language) => (
          <Button key={language} onClick={() => setLanguage(language)}>
            {msgAs(language).name}
          </Button>
        ))}
      </section>

      <section className="flex flex-col">
        <h2 className="text-xl font-semibold">{msg.universal.grades}</h2>
        <div className="my-4 grid max-w-sm grid-cols-5 gap-3">
          {grades ? (
            grades.map((grade) => <GradeTile key={grade.id} grade={grade} />)
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </section>

      <section className="flex flex-col">
        <h2 className="text-xl font-semibold">Timetable</h2>
        <pre>{JSON.stringify(timetable, undefined, 2)}</pre>
      </section>
    </div>
  );
}
