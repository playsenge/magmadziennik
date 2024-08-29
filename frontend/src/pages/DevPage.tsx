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
        devMsg("Failed to fetch subjects: " + error);
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
      <h1 className="text-3xl font-bold">Dev Page</h1>

      <section>
        <h2 className="text-xl font-semibold">Subjects</h2>
        {subjects.length ? (
          <ul className="ml-6 list-disc space-y-1">
            {subjects.map((subject) => (
              <li key={subject.id} className="text-sm">
                {subject.name} ({subject.shorthand}){" "}
                <span
                  onClick={() => devMsg(JSON.stringify(subject, undefined, 2))}
                  className="cursor-pointer underline"
                >
                  Log to console
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <LoadingSpinner />
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold">Your Subjects</h2>
        {studentSubjects.length ? (
          <ul className="ml-6 list-disc space-y-1">
            {studentSubjects.map((subject) => (
              <li key={subject.id} className="text-sm">
                {subject.name} ({subject.shorthand}){" "}
                <span
                  onClick={() => devMsg(JSON.stringify(subject, undefined, 2))}
                  className="cursor-pointer underline"
                >
                  Log to console
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <LoadingSpinner />
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold">Your current account</h2>
        <pre className="rounded border bg-gray-100 p-2">
          {JSON.stringify(pb.authStore.model ?? "null", null, 2)}
        </pre>
      </section>

      <section className="flex gap-4">
        <Button onClick={handleDemoLogin} variant="secondary">
          Login to Demo
        </Button>
        <Button onClick={handleClearAuth} variant="destructive">
          Clear auth
        </Button>
      </section>
    </div>
  );
}
