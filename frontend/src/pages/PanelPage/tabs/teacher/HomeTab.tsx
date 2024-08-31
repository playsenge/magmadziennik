import { useState, useEffect, useRef } from "react";
import { config } from "../../../../config";
import { GradeModel } from "../../../../database/interfaces";
import { Button } from "../../../../components/ui/button";

// Function to generate unique IDs for grades
const generateUniqueId = (prefix: string, index: number) =>
  `${prefix}-${index}`;

export default function TeacherHomeTab() {
  // TODO: Real DB data, quickKeyboard too little length if theres too many grades, memoization, mobile, dark & light mode

  const quickKeyboard = "qwertyuiopasdfghjklzxcvbnm-+[];',./".substring(
    0,
    config.grades.length,
  );

  const students = [
    { id: "ahiod213i", name: "John Doe" },
    { id: "bshd283js", name: "Jane Smith" },
    { id: "kshd292js", name: "Alice Johnson" },
    { id: "djshd922j", name: "Bob Brown" },
    { id: "dksj283kd", name: "Charlie Davis" },
    { id: "fsjd983sd", name: "Eva Green" },
    { id: "sjkd293jd", name: "George Harris" },
    { id: "slkd283js", name: "Hannah Lee" },
    { id: "ksjd282jd", name: "Ivan Miller" },
    { id: "fjdsk282k", name: "Judy White" },
  ];

  const generateGrades = () => {
    return students.reduce(
      (acc, student) => {
        acc[student.id] = Array.from({ length: 40 }, (_, i) => ({
          id: generateUniqueId(student.id, i), // Unique ID for each grade
          text: "",
          value: 0,
          color: "black",
        }));
        return acc;
      },
      {} as Record<string, GradeModel[]>,
    );
  };

  const [grades, setGrades] =
    useState<Record<string, GradeModel[]>>(generateGrades());
  const [focusedField, setFocusedField] = useState<{
    studentId: string;
    gradeId: string;
  } | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const gradesContainerRef = useRef<HTMLDivElement>(null);

  const setGradeAt = (
    studentId: string,
    gradeId: string,
    value: Omit<GradeModel, "id">,
  ) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [studentId]: prevGrades[studentId].map((grade) =>
        grade.id === gradeId ? { ...grade, ...value } : grade,
      ),
    }));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      tableRef.current &&
      !tableRef.current.contains(event.target as Node) &&
      gradesContainerRef.current &&
      !gradesContainerRef.current.contains(event.target as Node)
    ) {
      setFocusedField(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getGrade = (studentId: string, gradeId: string) => {
    return (
      grades[studentId]?.find((grade) => grade.id === gradeId) || {
        text: "",
        color: "black",
      }
    );
  };

  const computeChanges = (initialGrades: Record<string, GradeModel[]>) => {
    const changes: {
      studentId: string;
      gradeId: string;
      grade: GradeModel;
    }[] = [];
    for (const studentId in grades) {
      const currentStudentGrades = grades[studentId];
      const initialStudentGrades = initialGrades[studentId] || [];
      for (const currentGrade of currentStudentGrades) {
        const initialGrade = initialStudentGrades.find(
          (g) => g.id === currentGrade.id,
        );
        if (initialGrade && initialGrade.text !== currentGrade.text) {
          changes.push({
            studentId,
            gradeId: currentGrade.id,
            grade: currentGrade,
          });
        }
      }
    }

    console.log(changes);
    return changes;
  };

  return (
    <div className="flex flex-row items-start justify-between">
      <div className="-mt-4 h-[90.5vh] max-h-[90.5vh] min-h-[90.5vh] max-w-[76vw] overflow-auto">
        <table ref={tableRef} className="mb-3 mr-3 text-black dark:text-white">
          <thead>
            <tr>
              <th></th>
              <th></th>
              {[...Array(40)].map((_, i) => (
                <th key={i} className="py-1 text-center">
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="text-center">{student.id}</td>
                <td className="px-4 py-2">{student.name}</td>
                {[...Array(40)].map((_, i) => {
                  const grade = getGrade(
                    student.id,
                    generateUniqueId(student.id, i),
                  );
                  return (
                    <td key={i} className="text-center">
                      <input
                        type="text"
                        className={`size-12 rounded-md bg-gray-50 text-center font-mono focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 ${grade.text && "border-4"}`}
                        style={{
                          color: grade.color || "black",
                          borderColor: grade.color || "black",
                        }}
                        defaultValue={grade.text}
                        onFocus={() =>
                          setFocusedField({
                            studentId: student.id,
                            gradeId: grade.id,
                          })
                        }
                        onKeyDown={(e) => {
                          if (!quickKeyboard.includes(e.key)) return;

                          const grade =
                            config.grades[quickKeyboard.indexOf(e.key)];
                          setGradeAt(
                            student.id,
                            generateUniqueId(student.id, i),
                            grade,
                          );
                        }}
                        readOnly
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div ref={gradesContainerRef} className="grid grid-cols-2 gap-4">
        {config.grades.map((grade, i) => (
          <div
            key={grade.text}
            className="flex flex-col items-center justify-center gap-2"
          >
            <span className="text-white">{quickKeyboard[i]}</span>
            <div
              style={{ borderColor: grade.color, color: grade.color }}
              className="flex size-14 cursor-pointer items-center justify-center rounded-xl border-4 p-3 text-center font-mono text-xl"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent click from propagating to the document level

                if (!focusedField) return;

                const { studentId, gradeId } = focusedField;

                setGradeAt(studentId, gradeId, grade);
                setFocusedField(null);
              }}
            >
              {grade.text}
            </div>
          </div>
        ))}
        <Button
          className="col-span-2"
          onClick={() => computeChanges(generateGrades())}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
