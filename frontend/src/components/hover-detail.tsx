export default function HoverDetail({
  children,
}: {
  children: JSX.Element | JSX.Element[] | string;
}) {
  return (
    <div className="absolute mt-2 hidden w-56 rounded-r-xl bg-gray-300 p-1 text-xs text-black group-hover:block dark:bg-slate-950 dark:text-white">
      {children}
    </div>
  );
}
