import * as XLSX from "xlsx";

export function exportTasks(tasks, format) {
  const rows = tasks.map(t => ({
    Title: t.title,
    "Due Date": t.dueDate,
    Category: t.category,
    Status: t.completed ? "Completed" : "Incomplete",
  }));

  const sheet = XLSX.utils.json_to_sheet(rows);
  const headers = Object.keys(rows[0] ?? {});
    sheet["!cols"] = headers.map(h => ({
    wch: Math.max(h.length, ...rows.map(r => String(r[h] ?? "").length)) + 2,
    }));
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Tasks");
  XLSX.writeFile(book, `todo-tasks.${format}`);
}