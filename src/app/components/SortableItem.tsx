import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";

export default function SortableItem({
  children,
  id,
}: {
  children: JSX.Element;
  id: UniqueIdentifier;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });
  const style = transform
    ? {
        transition,
        transform: `translate3d(${transform.x}px, ${transform.y}px,0)`,
        boxShadow: " 1px 1px 2px 0px rgba(0, 0, 0, 0.2)",
        cursor: isDragging ? "grabbing" : "grab",
      }
    : undefined;

  return (
    <div style={style} ref={setNodeRef} {...listeners} {...attributes} role="button">
      {children}
    </div>
  );
}
