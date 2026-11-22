"use client";
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";
import { useState, useEffect} from "react";
import { Pagination, Dropdown, Tooltip,message } from "antd";
import { SearchOutlined, DownOutlined, ScheduleOutlined} from '@ant-design/icons';
import {arrayMove} from "@dnd-kit/sortable"

import Modal from "@/components/Modal";
import FilterSort from "@/components/FilterSort";
import ImportModal from "@/components/ImportModal";
import ExportModal from "@/components/ExportModal";
import SelectionBar from "@/components/SelectionBar";
import CalendarModal from "@/components/CalendarModal";

export default function Home() {

  const [tasks, setTasks] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortDueOrder, setSortDueOrder] = useState("none");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);

  const editingTask = tasks.find(t => t.id === editingId) ?? null;
  //const allSelected = tasks.length > 0 && selectedIds.length === tasks.length;
  const filteredTasks = tasks.filter(t=> {
    if(statusFilter === "completed") return t.completed;
    if(statusFilter === "incomplete") return !t.completed;
    return true;
  })
  const searchedTasks = searchText ? filteredTasks.filter(t => t.title.toLowerCase().includes(searchText.toLowerCase())) : filteredTasks;
  const sortedTasks = sortDueOrder === "none"? searchedTasks: [...searchedTasks].sort((a,b)=>{
     if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return sortDueOrder === "asc"
          ? a.dueDate.localeCompare(b.dueDate)
          : b.dueDate.localeCompare(a.dueDate);
  });
  const lastPage = Math.max(1, Math.ceil(sortedTasks.length / pageSize));
  const page = Math.min(currentPage, lastPage);
  const paginatedTasks = sortedTasks.slice((page - 1) * pageSize, page * pageSize);
  const pageIds = paginatedTasks.map(t => t.id);
  const allSelected = pageIds.length > 0 && pageIds.every(id => selectedIds.includes(id));
  const canReorder = reorderMode 
    && sortDueOrder === "none" && statusFilter === "all" && !searchText;
 
  //First Load
  useEffect(() => {
    const saved = localStorage.getItem("todo-tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  //Based on tasks
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  function addTask(newTask) {
    setTasks(prev => [{ id: crypto.randomUUID(), ...newTask, completed: false },...prev]);
    setCurrentPage(1);
    setIsAddOpen(false);
  }

  function updateTask(updated) {
    setTasks(prev => prev.map(t => (t.id === editingId ? { ...t, ...updated } : t)));
    setEditingId(null);
  }

  function deleteTask(taskId) {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setSelectedIds(prev => prev.filter(x => x !== taskId));
  }

  function confirmDelete() {
    if (confirm === "all") {
      setTasks([]);
      message.success("All tasks deleted");
    } else {
      setTasks(prev => prev.filter(t => !selectedIds.includes(t.id)));
      message.success(`${selectedIds.length} ${selectedIds.length >1 ? "tasks" : "task"} deleted`);
    }
    setSelectedIds([]);
    setConfirm(null);
}

  function markSelectedIds(completed){
    setTasks(prev=> prev.map(t=> (selectedIds.includes(t.id) ? {...t, completed: completed}: t)));
    setSelectedIds([]);
  }

  function toggleSelect(id) {
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter(x => x !== id)
        : [...selectedIds, id]
    );
  }

  // function toggleSelectAll(){
  //   setSelectedIds(allSelected ? [] : tasks.map(t => t.id));
  // }
  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(selectedIds.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedIds([...new Set([...selectedIds, ...pageIds])]);
    }
  }

  function importTasks(newTasks) {
    setTasks(prev => [ ...newTasks.map(t => ({ id: crypto.randomUUID(), ...t })),...prev]);
    setCurrentPage(1);
    message.success(`Imported ${newTasks.length} tasks`);
  }

  function reorderTasks(activeId, overId) {
    setTasks(prev => {
      const from = prev.findIndex(t => t.id === activeId);
      const to = prev.findIndex(t => t.id === overId);
      return arrayMove(prev, from, to);
    });
  }

  function changeReorderMode(on) {
    if (on) {
      setStatusFilter("all");
      setSortDueOrder("none");
      setSearchText("");
    }
    setReorderMode(on);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 text-gray-900">
      <div className="mx-auto max-w-7xl rounded-xl bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-semibold">Todo App</h1>
        <div className="mb-6 flex flex-wrap items-center gap-2" >
          <div className="relative min-w-50 flex-1">
            <SearchOutlined className="pointer-events-none text-xs absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchText}
              onChange={e => {setSearchText(e.target.value); setCurrentPage(1); setReorderMode(false);}}
              placeholder="Search tasks by title"
              className="w-full rounded-lg border border-gray-300 py-2 
              pl-9 pr-8 text-sm outline-none focus:border-blue-500"
            />
            {searchText && (
              <button
                onClick={() => {setSearchText(""); setCurrentPage(1)}}
                className="absolute right-2 top-1/2 -translate-y-1/2 
                cursor-pointer text-gray-400 hover:text-gray-700">
                x
              </button>
            )}
          </div>

          <FilterSort statusFilter = {statusFilter} sortDueOrder = {sortDueOrder}
            reorderMode={reorderMode} onReorderChange={changeReorderMode}
            onFilter={e => {setStatusFilter(e); setCurrentPage(1); setReorderMode(false);}} 
            onSort={e=>{setSortDueOrder(e);setCurrentPage(1); setReorderMode(false);}}
          />
    
          <button
              onClick={() => setIsAddOpen(true)}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm 
              font-medium cursor-pointer text-white 
              hover:bg-blue-700">
              + Add
          </button>

          <div className="ml-auto flex gap-2 pl-8 ">  
            <Tooltip title="Calendar view">
                <button className="flex cursor-pointer
                  items-center justify-center rounded-lg 
                  border border-gray-500 px-3 py-2 text-sm 
                  hover:border-blue-500 hover:text-blue-600"
                  onClick={()=> setIsCalendarOpen(true)}>
                  <ScheduleOutlined/>
                </button>
            </Tooltip>           
            <Dropdown
              menu={{
                items: [
                  { key: "import", label: "Import" },
                  { key: "export", label: "Export" },
                  { type: "divider" },
                  { key: "delete", label: "Delete all",danger: true, disabled: tasks.length === 0  },

                ],
                onClick: ({ key }) => {
                   if(key ==="import") setIsImportOpen(true);
                   if(key ==="export") setIsExportOpen(true);
                   if(key === "delete") setConfirm("all");
                  },
              }}
              trigger={["click"]}>
              <button className="rounded-lg flex items-center gap-1 border border-gray-500 px-3 py-2 text-sm cursor-pointer hover:border-blue-500">
                Options
                <DownOutlined className="text-xs"/>
              </button>
            </Dropdown>
          </div>
        </div>
        
        <SelectionBar allSelected={allSelected} selectedIds={selectedIds} 
         toggleSelectAll={toggleSelectAll} onMark={markSelectedIds} 
         onClear={()=> setSelectedIds([])} onDeleteSelect={()=> setConfirm("selected")}/>
        
        <TodoList
          tasks={paginatedTasks}
          totalCount={tasks.length}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onEdit={setEditingId}
          onDelete={deleteTask}
          canReorder={canReorder}
          onReorder={reorderTasks}
        />
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm text-gray-500">Page {page} of {lastPage}</span>
          <Pagination showSizeChanger
              pageSizeOptions={[5, 10, 15, 20, 50]}
              current={page}
              pageSize={pageSize}
              total={sortedTasks.length}
              onChange={(newPage, newSize) => {
                setCurrentPage(newPage);
                setPageSize(newSize);
              }}
             />
        </div>
      </div>

      {isImportOpen && <ImportModal onClose={() => setIsImportOpen(false)} onImport={importTasks}/>}

      {isExportOpen && (
        <ExportModal tasks ={tasks}
         paginatedTasks = {paginatedTasks}
         selectedTasks = {tasks.filter(t => selectedIds.includes(t.id))}
         onClose={()=> setIsExportOpen(false)}
        />
      )}
        
      {isAddOpen && (
        <AddTodo onAdd={addTask} onCancel={() => setIsAddOpen(false)} />
      )}
      {editingTask && (
        <AddTodo
          editingTask={editingTask}
          onUpdate={updateTask}
          onCancel={() => setEditingId(null)}
        />
      )}

      {isCalendarOpen &&(
        <CalendarModal tasks={tasks} onClose={()=>setIsCalendarOpen(false)} />
      )}

      {confirm && (
      <Modal
        title={confirm === "all" ? "Delete all tasks?" : "Delete selected tasks?"}
        footer={
          <>
            <button
              onClick={() => setConfirm(null)}
              className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          {confirm === "all"
            ? `This will permanently delete all ${tasks.length} tasks.`
            : `This will permanently delete ${selectedIds.length} selected tasks.`}{" "}
          This cannot be undone.
        </p>
      </Modal>
    )}
    </main>
  );
}
