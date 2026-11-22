"use client"
import {useState} from 'react'
import Modal from "@/components/Modal";
import { exportTasks } from "@/lib/exportTasks";
import {  message } from "antd";

export default function ExportModal({tasks,paginatedTasks,selectedTasks,onClose}){

    const [scope, setScope] = useState(selectedTasks.length > 0 ? "selected" : "all");
    const [format, setFormat] = useState("xlsx");

    function handleExport() {
        const lists = {
          selected: selectedTasks,
          page: paginatedTasks,
          all: tasks,
        };
    
        const list = lists[scope];
    
        if (list.length === 0) {
          message.warning("No tasks to export");
          return;
        }
    
        exportTasks(list, format);
        onClose();
      }
      return(
        <>
        <Modal
          title="Export tasks"
          footer={
            <>
              <button
                onClick={onClose}
                className="cursor-pointer rounded-lg 
                border border-gray-300 
                px-4 py-2 text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="cursor-pointer rounded-lg
               bg-blue-600 px-4 py-2 text-sm font-medium 
               text-white hover:bg-blue-700">
                Export
              </button>
            </>
          }>  
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm">
              Tasks
              <select
                value={scope}
                onChange={e => setScope(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none 
                focus:border-blue-500">
                {selectedTasks.length > 0 && (
                  <option value="selected">Selected tasks ({selectedTasks.length})</option>
                )}
                <option value="page">Current page ({paginatedTasks.length})</option>
                <option value="all">All tasks ({tasks.length})</option>
              </select>
            </label>  
            <div className="flex flex-col gap-1 text-sm">
              Format
              <div className="grid grid-cols-2">
                {[
                  { value: "xlsx", label: "Excel" },
                  { value: "csv", label: "CSV" },
                ].map(f => (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f.value)}
                    className={`cursor-pointer border px-3 py-1.5 text-sm first:rounded-l-lg last:rounded-r-lg ${
                        format === f.value
                        ? "border-blue-500 text-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
        </>
      )

}