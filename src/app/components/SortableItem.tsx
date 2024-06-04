import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Opacity } from "@mui/icons-material";
import zIndex from "@mui/material/styles/zIndex";

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
        transform: isDragging ? `translate3d(${transform.x}px, ${transform.y}px,0) scale(1.02)`: `translate3d(${transform.x}px, ${transform.y}px,0)`,
        boxShadow: isDragging ? " 1px 1px 5px 0px rgba(0, 0, 0, 0.5)": "none",
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: isDragging ? "1": "0",
        opacity: isDragging ? "1": "0.5"
      }
    : undefined;

  return (
    <div style={style} ref={setNodeRef} {...listeners} {...attributes} role="button">
      {children}
    </div>
  );
}
