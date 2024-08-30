import { useEffect, useState } from "react";
import {
  getSubjects,
  getSubjectsForStudent,
  login,
  pb,
} from "../database/pocketbase";
import { Subject } from "../database/interfaces";
import { Button } from "../components/ui/button";
import { useRerender } from "../components/hooks/rerender";
import LoadingSpinner from "../components/loading-spinner";
import { devMsg } from "../utils";
import { availableLanguages, msg, msgAs, setLanguage } from "../language";
import { config } from "../config";
import GradeTile from "../components/grade-tile";

export default function DevPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studentSubjects, setStudentSubjects] = useState<Subject[]>([]);

  const rerender = useRerender();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setSubjects(await getSubjects());
      } catch (error) {
        devMsg("Failed to fetch subjects: " + error);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchStudentSubjects = async () => {
      try {
        setStudentSubjects(await getSubjectsForStudent());
      } catch (error) {
        devMsg("Failed to fetch student subjects: " + error);
      }
    };
    fetchStudentSubjects();
  }, []);

  const handleClearAuth = () => {
    pb.authStore.clear();
    rerender();
  };

  const handleDemoLogin = async () => {
    try {
      await login("demo@demo.com", "12345678");
      rerender();
    } catch (error) {
      devMsg("Login failed: " + error);
    }
  };

  if (!import.meta.env.DEV) return null;

  return (
    <div className="ml-4 mt-4 space-y-4">
      <h1 className="text-3xl font-bold">{msg.dev_page.title}</h1>

      <section>
        <h2 className="text-xl font-semibold">{msg.universal.subjects}</h2>
        {subjects.length ? (
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
        {studentSubjects.length ? (
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
        <Button onClick={handleDemoLogin} variant="secondary">
          {msg.dev_page.login_as_demo}
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
          {subjects.length &&
            config.grades.map((grade) => (
              <GradeTile key={grade.text} grade={grade} subject={subjects[0]} />
            ))}
        </div>
      </section>
    </div>
  );
}
