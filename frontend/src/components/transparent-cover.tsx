export default function TransparentCover({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}) {
  return (
    <div
      aria-hidden={true}
      style={{
        zIndex: 10,
        position: "fixed",
        inset: 0,
        backgroundColor: "transparent",
        WebkitTapHighlightColor: "transparent",
      }}
      onClick={onClick}
    ></div>
  );
}
