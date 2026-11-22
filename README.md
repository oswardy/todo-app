# To-Do Tasks Application

A to-do list application built as part of a technical assessment.

**Live Demo:** https://todo-app-two-eta-59.vercel.app/

## Technologies Used

- Next.js (App Router)
- React
- Tailwind CSS
- Ant Design
- SheetJS (`xlsx`) for Excel and CSV
- react-big-calendar and dayjs
- dnd-kit

## Features (Based on Requirements)

- Add, edit, delete and mark tasks as complete or incomplete.
- Each task has a title, a due date and a category (Work, Personal or Urgent).
- Select several tasks to mark them complete, incomplete or delete them (with a confirmation).
- Pagination with a page size selector (5, 10, 15, 20, 50) and a "Page X of Y" indicator.
- Search by title, filter by status, and sort by due date (ascending or descending).
- Tasks are saved in the browser, so they are still there after a refresh.
- Import tasks from CSV or Excel. Rows with problems are skipped, and a summary lists them.
- Export tasks to Excel or CSV (selected tasks, current page, or all tasks).
- Calendar view that shows tasks on their due dates, colored by category. Days with many tasks have a "+N more" list, and you can jump to any month and year.
- Drag and drop to reorder tasks.

## Remarks

- **Project structure:** The sample structure uses `App.js` and `index.js`, but Next.js uses the `app/` folder, so the main page is `app/page.js`. The edit form is the same component as the add form (`AddTodo`), so there is no separate `EditTodo`. The state lives in `page.js`, and I did not split it into a `useTodos` hook.
- **Storage:** I used `localStorage` because the app is small and the requirement asks for local storage. Data stays in each browser and does not sync across devices.
- **Import format:** The file needs these columns: `Title` (required), `Due Date` (YYYY-MM-DD), `Category` (Work, Personal or Urgent, empty means Work) and `Status` (Completed or Incomplete, empty means incomplete). Header names must match exactly and rows with a missing title or an unknown category are skipped. Imported tasks are added to the top of the list.
- **Export:** "All tasks" exports everything. When a CSV is opened in Excel, the due date column may show `####` until the column is widened. The Excel export has the widths set already.
- **Sorting:** Tasks with no due date always stay at the bottom in both ascending and descending.
- **Select all:** It selects only the tasks on the current page, the number depends on the page size you picked
- **Drag and drop:** I used dnd-kit because react-beautiful-dnd is no longer maintained. Reordering only works when the "Reorder tasks" switch is on, and the switch clears the search, filter and sort first, because they change what is shown. Tasks can be dragged within the current page.

## Getting Started (Local Development)

### 1. Install dependencies

```bash
npm install
```

### 2. Run the application

```bash
npm run dev
```

### 3. Access the application

Open `http://localhost:3000`. No environment variables are needed.
