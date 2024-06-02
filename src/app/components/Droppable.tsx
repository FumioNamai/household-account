import { UniqueIdentifier, useDroppable } from "@dnd-kit/core";

export default function Droppable({
  children,
  id,
}: {
  children: JSX.Element;
  id: UniqueIdentifier;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return <div ref={setNodeRef}>{children}</div>;
}
