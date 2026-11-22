"use client";
import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";
import Modal from "@/components/Modal";

const EMPTY_TASK = { title: "", dueDate: "", category: "Work" };
const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500";

export default function AddTodo({ onAdd, onUpdate, onCancel, editingTask = null }) {
  const [newTask, setNewTask] = useState(editingTask ?? EMPTY_TASK);
  const isEditing = editingTask !== null;

  function handleSubmit() {
    if (!newTask.title.trim()) return;
    if (isEditing) {
      onUpdate(newTask);
    } else {
      onAdd(newTask);
    }
  }

  return (
    <Modal title={isEditing ? "Edit task" : "Add new task"}
        footer={
            <>
                <button
                    onClick={onCancel}
                    className="rounded-lg 
                    border border-gray-300 
                    px-4 py-2 text-sm hover:bg-gray-50">
                Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="rounded-lg
                  bg-blue-600 px-4 py-2 text-sm font-medium 
                  text-white hover:bg-blue-700">
                {isEditing ? "Save" : "Add"}
                </button>
            </>
        }>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Title
            <input
              className={inputClass}
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Due date
            <input
              type="date"
              className={`${inputClass} cursor-pointer`}
              value={newTask.dueDate}
              onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
              onClick={e => {
                try {
                e.currentTarget.showPicker();
                } catch {}
              }}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Category
            <select
              className={`${inputClass} cursor-pointer`}
              value={newTask.category}
              onChange={e => setNewTask({ ...newTask, category: e.target.value })}>
                {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>
          </label>
        </div>
    </Modal>
    
  );
}