"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { OutlineItem as OutlineItemType } from "@/types/blog"

interface OutlineItemProps {
  item: OutlineItemType
  onDelete: (id: string) => void
}

export function OutlineItem({ item, onDelete }: OutlineItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 p-3 bg-card border rounded-lg",
        item.heading === "H3" && "ml-8",
        isDragging && "opacity-50"
      )}
    >
      <button {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </button>
      <span className="text-xs font-mono text-muted-foreground w-8">
        {item.heading}
      </span>
      <span className="flex-1">{item.title}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(item.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
