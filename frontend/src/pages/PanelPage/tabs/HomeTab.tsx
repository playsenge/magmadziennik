import { msg } from "../../../language";

export default function HomeTab() {
  return <>
    <div className="">
    <div className="grid grid-cols-3 gap-4">
  <div className="h-64 rounded-2xl bg-white">
    <h1 className="m-3 text-4xl">{msg.universal.grades}</h1>
    <div className="rounded-xl border-3 p-5"><span className="block text-xl text-red-500 w-10 h-10">4+</span></div>
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

    </div>
  </>;
}
