import * as XLSX from "xlsx";
import { CATEGORIES } from "@/lib/constants";

const DONE_WORDS = ["completed", "complete", "done", "true", "yes"];

// Returns "YYYY-MM-DD"
function toDateString(value) {
  if (!value) return "";
  if (value instanceof Date) {
    if (isNaN(value)) return null;
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  const text = String(value).trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : null;
}

export async function parseTasksFile(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);

  const tasks = [];
  const skipped = [];
  let badDates = 0;

  rows.forEach((row, i) => {
    const line = i + 2; // line 1 of the file is the header

    const title = String(row["Title"] ?? "").trim();
    if (!title) {
      skipped.push({ line, reason: "Missing title" });
      return;
    }

    const rawCategory = String(row["Category"] ?? "").trim();
    const category = rawCategory
      ? CATEGORIES.find(c => c.toLowerCase() === rawCategory.toLowerCase())
      : "Work";
    if (!category) {
      skipped.push({ line, reason: `Unknown category "${rawCategory}"` });
      return;
    }

    const date = toDateString(row["Due Date"]);
    if (date === null) badDates++;

    tasks.push({
      title,
      dueDate: date ?? "",
      category,
      completed: DONE_WORDS.includes(String(row["Status"] ?? "").trim().toLowerCase()),
    });
  });

  return { tasks, skipped, badDates };
}