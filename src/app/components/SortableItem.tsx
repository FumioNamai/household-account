import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";

export default function SortableItem({
  children,
  id,
  isListedCount,
}: {
  children: JSX.Element;
  id: UniqueIdentifier;
  isListedCount:number;
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

  const style = transform && isListedCount > 1
    ? {
        transition,
        transform: isDragging ? `translate3d(${transform.x}px, ${transform.y}px,0) scale(1.02)`: `translate3d(${transform.x}px, ${transform.y}px,0)`,
        boxShadow: isDragging ? " 1px 1px 5px 0px rgba(0, 0, 0, 0.5)": "none",
        cursor: "grabbing",
        zIndex: isDragging ? "1": "0",
        opacity: isDragging ? "1": "0.5"
      }
    : { cursor: "grab"};

  return (
    <div style={style} ref={setNodeRef} {...listeners} {...attributes} role="button">
      {children}
    </div>
  );
}
