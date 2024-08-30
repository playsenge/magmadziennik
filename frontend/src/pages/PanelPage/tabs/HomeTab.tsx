import GradeTile from "../../../components/grade-tile";
import { config } from "../../../config";
import { msg } from "../../../language";

export default function HomeTab() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="h-64 overflow-hidden rounded-2xl bg-white p-3">
        <h1 className="m-3 text-3xl">{msg.universal.grades}</h1>
        <div className="mx-4 flex h-32 flex-wrap gap-4 overflow-y-auto">
          {config.grades.map((grade) => (
            <GradeTile key={grade.text} grade={grade} />
          ))}
        </div>
      </div>
      <div className="h-64 rounded-2xl bg-white">
        <h1 className="m-3 text-4xl">{msg.tabs.tests}</h1>
      </div>
      <div className="h-64 rounded-2xl bg-white">
        <h1 className="m-3 text-4xl">{msg.tabs.homework}</h1>
      </div>
      <div className="col-span-2 h-64 rounded-2xl bg-white">
        <h1 className="m-3 text-4xl">{msg.universal.timetable}</h1>
      </div>
      <div className="h-64 rounded-2xl bg-white">
        <h1 className="m-3 text-4xl">{msg.tabs.attendance}</h1>
      </div>
      <div className="h-64 rounded-2xl bg-white">
        <h1 className="m-3 text-4xl">{msg.tabs.messages}</h1>
      </div>
      <div className="col-span-2 h-64 rounded-2xl bg-white">
        <h1 className="m-3 text-4xl">idk</h1>
      </div>
    </div>
  );
}
