export default function Grade({grade, subject, color1, color2}) {
  return (
    <div className="size-16 rounded text-white"><p className="flex h-12 w-16 flex-col items-center justify-center rounded-t bg-red-400 text-3xl">{grade}</p><p className="h-4 w-16 rounded-b bg-red-500 text-xs">{subject}</p></div>

  );
}
