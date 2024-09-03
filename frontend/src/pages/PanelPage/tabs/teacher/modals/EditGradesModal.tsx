import { useState, useRef, useEffect } from "react";
import { Button } from "../../../../../components/ui/button";
import { config } from "../../../../../config";
import { EditedGrade, GradeModel } from "../../../../../database/interfaces";

export default function EditGradesModal(props: {
  hook: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // TODO: Real DB data, quickKeyboard too little length if theres too many grades, memoization, mobile, dark & light mode
  // TODO: dodać opcję wstawiania ocen losowo dla pewnego nauczyciela HiTu

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
    { id: "sadfasgfs", name: "George Harris" },
    { id: "asgasg", name: "Hannah Lee" },
    { id: "ass", name: "Ivan Miller" },
    { id: "asasg", name: "Judy White" },
    { id: "drfg", name: "Hannah Lee" },
    { id: "1", name: "Ivan Miller" },
    { id: "2", name: "Judy White" },
    { id: "3", name: "Hannah Lee" },
    { id: "4", name: "Ivan Miller" },
    { id: "5", name: "Judy White" },
    { id: "6", name: "Hannah Lee" },
    { id: "7", name: "Ivan Miller" },
    { id: "8", name: "Judy White" },
  ];

  const columns = [
    { id: "abcdef", name: "SPR1" },
    { id: "aabdef", name: "SPR2" },
    { id: "abbdef", name: "SPR3" },
  ];

  const generateGrades = () => {
    return students.reduce(
      (acc, student) => {
        acc[student.id] = Array.from({ length: columns.length }, (_, i) => ({
          student: student.id,
          column: columns[i].id,
          text: "",
          value: 0,
          color: "black",
        }));
        return acc;
      },
      {} as Record<string, EditedGrade[]>,
    );
  };

  const [grades, setGrades] =
    useState<Record<string, EditedGrade[]>>(generateGrades());
  const [focusedField, setFocusedField] = useState<{
    studentId: string;
    columnId: string;
  } | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const gradesContainerRef = useRef<HTMLDivElement>(null);

  const setGradeAt = (
    studentId: string,
    columnId: string,
    value: GradeModel | null,
  ) => {
    setGrades((prevGrades) => ({
      ...prevGrades,
      [studentId]: prevGrades[studentId].map((grade) =>
        grade.student === studentId && grade.column === columnId
          ? value
            ? { ...grade, ...value }
            : { ...grade, text: "", color: "black" } // Handle deletion
          : grade,
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

  const getGrade = (studentId: string, columnId: string) => {
    return (
      grades[studentId]?.find(
        (grade) => grade.student === studentId && grade.column === columnId,
      ) || {
        text: "",
        color: "black",
      }
    );
  };

  const computeChanges = (initialGrades: Record<string, EditedGrade[]>) => {
    const changes: {
      studentId: string;
      columnId: string;
      grade: GradeModel;
    }[] = [];
    for (const studentId in grades) {
      const currentStudentGrades = grades[studentId];
      const initialStudentGrades = initialGrades[studentId] || [];
      for (const currentGrade of currentStudentGrades) {
        const initialGrade = initialStudentGrades.find(
          (g) => g.student === studentId && g.column === currentGrade.column,
        );
        if (initialGrade && initialGrade.text !== currentGrade.text) {
          changes.push({
            studentId,
            columnId: currentGrade.column,
            grade: currentGrade,
          });
        }
      }
    }

    console.log(changes);
    return changes;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:items-start md:justify-between">
      <div className="-mt-4 max-h-[80vh] max-w-full overflow-auto md:max-w-[76vw]">
        <table ref={tableRef} className="mb-3 mr-3 text-black dark:text-white">
          <thead>
            <tr>
              <th></th>
              <th></th>
              {columns.map((i) => (
                <th key={i.id} className="py-1 text-center">
                  {i.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, i) => (
              <tr key={student.id}>
                <td className="text-center">{i + 1}</td>
                <td className="px-4 py-2">{student.name}</td>
                {columns.map((i) => {
                  const grade = getGrade(student.id, i.id);
                  return (
                    <td key={i.id} className="text-center">
                      <input
                        type="text"
                        className={`size-12 rounded-md bg-gray-50 text-center font-mono focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 ${grade.text && "border-4"}`}
                        style={{
                          color: grade.color || "black",
                          borderColor: grade.color || "black",
                        }}
                        defaultValue={grade.text}
                        onFocus={() =>
                          setFocusedField({
                            studentId: student.id,
                            columnId: i.id,
                          })
                        }
                        onKeyDown={(e) => {
                          if (["Backspace", "Delete"].includes(e.key)) {
                            setGradeAt(student.id, i.id, null);
                            return;
                          }

                          if (!quickKeyboard.includes(e.key)) return;

                          const grade =
                            config.grades[quickKeyboard.indexOf(e.key)];
                          setGradeAt(student.id, i.id, grade);
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

      <div ref={gradesContainerRef} className="grid grid-cols-3 gap-4">
        {config.grades.map((grade, i) => (
          <div
            key={grade.text}
            className="flex flex-col items-center justify-center gap-1"
          >
            <div
              style={{ borderColor: grade.color, color: grade.color }}
              className="flex size-14 cursor-pointer items-center justify-center rounded-xl border-4 p-3 text-center font-mono text-xl"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent click from propagating to the document level

                if (!focusedField) return;

                const { studentId, columnId } = focusedField;

                setGradeAt(studentId, columnId, grade);
                setFocusedField(null);
              }}
            >
              <div className="relative">
                {grade.text}
                <div className="text-center text-xs">{quickKeyboard[i]}</div>
              </div>
            </div>
          </div>
        ))}
        <Button
          className="col-span-3"
          onClick={() => {
            computeChanges(generateGrades());
            props.hook(false);
            setTimeout(() => {
              alert("saved");
            }, 1000);
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
