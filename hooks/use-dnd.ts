"use client";

import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

interface DragItem {
  index: number;
  id: string;
  type: string;
}

interface UseDragDropParams {
  index: number;
  id: string;
  moveBlock: (dragIndex: number, hoverIndex: number) => void;
  isEditing: boolean;
}

export function useDragDrop({
  index,
  id,
  moveBlock,
  isEditing,
}: UseDragDropParams) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "BLOCK",
    item: { index, id, type: "BLOCK" } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => isEditing,
  });

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: string | symbol | null }
  >({
    accept: "BLOCK",
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover(item: DragItem, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset?.y || 0) - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveBlock(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return { ref, isDragging, handlerId };
}
