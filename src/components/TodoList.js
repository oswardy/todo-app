"use client";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TodoItem from "@/components/TodoItem";


function SortableRow({ id, enabled, children }) {
  const {
    attributes, listeners, setNodeRef, setActivatorNodeRef,
    transform, transition, isDragging,
  } = useSortable({ id, disabled: !enabled });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : undefined,
        opacity: isDragging ? 0.8 : 1,
      }}
      className="relative flex items-stretch gap-2"
    >
      {enabled && (
        <button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="cursor-grab touch-none px-1 text-gray-400 hover:text-gray-700 active:cursor-grabbing"
        >
          ⋮⋮
        </button>
      )}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export default function ToDoList({tasks, totalCount, onDelete, onEdit, onToggleSelect,selectedIds,canReorder, onReorder})
{
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
    if (tasks.length === 0) {
        return(
            <p className="py-10 text-center text-gray-400">
                {totalCount === 0 ? "No tasks yet" : "No tasks match your search"}
            </p>
        );
    }
    function handleDragEnd({ active, over }) {
        if (over && active.id !== over.id) onReorder(active.id, over.id);
    }
    return(
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-3">
                    {tasks.map(t=>(
                        <SortableRow key={t.id} id={t.id} enabled={canReorder}>
                            <TodoItem key={t.id} task={t} 
                                onDelete={onDelete} 
                                onEdit={onEdit} 
                                onToggleSelect={onToggleSelect}
                                selected = {selectedIds.includes(t.id)}
                            />
                        </SortableRow>
                        
                    ))}
                </div>
            </SortableContext>
        </DndContext>
        
    )
}