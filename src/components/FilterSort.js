import { Popover, Switch} from "antd";
import { FilterOutlined } from '@ant-design/icons';
export default function FilterSort({statusFilter,sortDueOrder,onFilter,onSort,reorderMode,onReorderChange}){
    return(
        <Popover trigger="click" placement="bottomLeft" 
            content={
              <div className="flex flex-col gap-3 w-64">
                <label className="flex flex-col gap-1 text-sm">
                  Filter by status
                  <select
                    value={statusFilter}
                    onChange={e => {
                      onFilter(e.target.value);
                    }}
                    className="rounded border outline-none focus:border-blue-500 
                    hover:border-blue-500 border-gray-300 px-2 py-1.5 
                    text-sm cursor-pointer" >
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="incomplete">Incomplete</option>
                  </select>
                </label>
                
                <label className="flex flex-col gap-1 text-sm">
                  Sort by due date
                  <select
                    value={sortDueOrder}
                    onChange={e => {
                      onSort(e.target.value);
                    }}
                    className="rounded border outline-none focus:border-blue-500 
                    hover:border-blue-500 border-gray-300 px-2 py-1.5 
                    text-sm cursor-pointer">
                    <option value="none">No sort</option>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </label>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center justify-between text-xm">
                    <span>Reorder tasks (Drag & Drop)</span>
                    <Switch size="medium" checked={reorderMode} onChange={onReorderChange} />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Turning this on clears the filter, sort and search.
                  </p>
                </div>
              </div>
            }>
            <button className="rounded-lg flex items-center gap-1 border border-gray-700 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ">
                <FilterOutlined className="text-xs" />
                Filter & Sort
            </button>
          </Popover>
        
    )
}