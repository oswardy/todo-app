import { CATEGORY_COLORS } from "@/lib/constants";
import {  EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {Tooltip, Popconfirm} from "antd"

export default function TodoItem({ task, selected, onToggleSelect, onEdit, onDelete }) {
  return (
    <div
      className={`flex items-start gap-4 rounded-xl border p-4 ${
        selected ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-white"
      }`}>
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 cursor-pointer"
        checked={selected}
        onChange={() => onToggleSelect(task.id)}
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`font-medium ${
              task.completed ? "text-gray-400 line-through" : "text-gray-900"
            }`}
          >
            {task.title}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[task.category]}`}>
            {task.category}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              task.completed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
            }`}
          >
            {task.completed ? "Completed" : "Incomplete"}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {task.dueDate ? `Due ${task.dueDate}` : "No due date"}
        </p>
      </div>

      <div className="flex gap-2">
        <Tooltip title="Edit Task">
            <button
                onClick={() => onEdit(task.id)}
                className="rounded-lg border
                border-blue-300 px-3 py-1 text-sm 
                cursor-pointer text-blue-600 bg-blue-100 hover:bg-blue-200">
                <EditOutlined/>
            </button>
        </Tooltip>
        <Popconfirm title="Delete task"
            placement="top"
            okText="Delete"
            okButtonProps={{danger:true}}
            description="Are you sure to delete this task?"
            icon={<QuestionCircleOutlined style={{ color: 'red' }}/>}
            onConfirm={()=> onDelete(task.id)}>
            <button
                className="rounded-lg border
                border-red-300 px-3 py-1 text-sm 
                text-red-600 cursor-pointer bg-red-100 hover:bg-red-200">
                <DeleteOutlined/>
            </button>
        </Popconfirm>
        
      </div>
    </div>
  );
}