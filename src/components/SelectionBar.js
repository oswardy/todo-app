export default function SelectionBar({selectedIds,allSelected,toggleSelectAll,onMark,onClear,onDeleteSelect}){
    return(
        <div 
          className={`mb-4 flex flex-wrap items-center gap-2 rounded-xl border px-4 py-3 ${
            selectedIds.length > 0
              ? "border-blue-200 bg-blue-100"
              : "border-gray-200 bg-gray-50"
          }`}>
          <label className="flex items-center gap-2 text-base cursor-pointer"> 
            <input
              className="h-4 w-4 cursor-pointer accent-blue-700"
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
            />
            {selectedIds.length > 0 ? (
            <span className="ml-2">
              <b>{selectedIds.length}</b> {selectedIds.length > 1 ? "tasks" : "task"} selected
            </span>
            ) : (
              "Select all"
            )}
          </label>  
          {selectedIds.length > 0 && (
          <div className="ml-auto flex gap-2 items-center">
            <button
              onClick={onClear}
              className="cursor-pointer rounded-md
                border border-gray-300 bg-white 
                px-2 py-1.5 text-sm text-gray-700 hover:text-gray-900">
              {selectedIds.length > 1 ? "Clear Selections" : "Clear Selection"}
            </button>

            <button
              onClick={()=> onMark(false)}
              className="cursor-pointer rounded-md 
                border border-gray-300 font-medium
                bg-white px-3 py-1.5 text-sm hover:bg-gray-50">
              Mark Incomplete
            </button>

            <button
              onClick={()=> onMark(true)}
              className="cursor-pointer rounded-md 
                border border-gray-300 font-medium
                bg-white px-3 py-1.5 text-sm 
                hover:border-blue-500 hover:text-blue-600">
              Mark Complete
            </button>
        
            <button
              onClick={onDeleteSelect}
              className="cursor-pointer rounded-md
              border border-red-300 
              bg-white px-3 py-1.5 text-sm 
              text-red-600 hover:bg-red-50">
              {selectedIds.length > 1 ? "Delete Selections" : "Delete Selection"}
            </button>
          </div>
          )}
        </div>
    )
}