"use client";
import { useState } from "react";
import Modal from "@/components/Modal";
import { parseTasksFile } from "@/lib/importTasks";

export default function ImportModal({ onImport, onClose }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setError("");
    try {
      setResult(await parseTasksFile(file));
    } catch {
      setResult(null);
      setError("Could not read this file. Please use a .csv, .xlsx or .xls file.");
    }
  }

  function handleImport() {
    onImport(result.tasks);
    onClose();
  }

  const canImport = result !== null && result.tasks.length > 0;

  return (
    <Modal
      title="Import tasks"
      footer={
        <>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg 
            border border-gray-300 px-4 py-2 
            text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!canImport}
            className="cursor-pointer rounded-lg 
            bg-blue-600 px-4 py-2 text-sm font-medium text-white 
            hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
            Import
          </button>
        </>
      }>
      <div className="flex flex-col gap-4 text-sm">
        <div>
          <p className="mb-1 text-gray-600">
            Your file needs a header row with these columns:
          </p>
          <ul className="list-disc pl-5 text-gray-500">
            <li><b>Title</b> (required)</li>
            <li><b>Due Date</b> (YYYY-MM-DD)</li>
            <li><b>Category</b> (Work, Personal or Urgent)</li>
            <li><b>Status</b> (Completed or Incomplete)</li>
          </ul>
          <p className="text-gray-600 mt-2">
            Accepted files: .csv, .xlsx, .xls. 
          </p>
        </div>

        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFile}
          className="block w-full text-sm file:mr-3 
          file:cursor-pointer file:rounded-lg file:border 
          file:border-gray-300 file:bg-white file:px-3 file:py-1.5 hover:file:bg-gray-50"
        />
        

        {error && <p className="text-red-600">{error}</p>}

        {result && (
          <div className="rounded-lg bg-gray-50 p-3">
            <p>
              <b>{result.tasks.length}</b> tasks ready to import
            </p>

            {result.skipped.length > 0 && (
              <div className="mt-2">
                <p className="text-red-600">
                  <b>{result.skipped.length}</b> rows skipped
                </p>
                <ul className="mt-1 max-h-24 overflow-y-auto text-gray-600">
                  {result.skipped.map(s => (
                    <li key={s.line}>Line {s.line}: {s.reason}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.badDates > 0 && (
              <p className="mt-2 text-amber-600">
                {result.badDates} dates could not be read and were left empty. Use
                YYYY-MM-DD.
              </p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}