"use client";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "@/components/Modal";
import { useState } from "react";
import { CATEGORIES, CATEGORY_HEX } from "@/lib/constants";

const localizer = dayjsLocalizer(dayjs);

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const selectClass = `cursor-pointer rounded-lg border 
  border-gray-300 px-2 py-1 text-sm 
  outline-none hover:border-blue-500 focus:border-blue-500`;

function toLocalDate(text) {
    const [y, m, d] = text.split("-").map(Number);
    return new Date(y, m - 1, d);
}

export default function CalendarModal({ tasks, onClose }) {
    const [date, setDate] = useState(new Date());
    const [dayList, setDayList] = useState(null);
    const events = tasks
        .filter(t => t.dueDate)
        .map(t => ({
        title: t.title,
        start: toLocalDate(t.dueDate),
        end: toLocalDate(t.dueDate),
        allDay: true,
        task: t,
        }));

    const undatedCount = tasks.length - events.length;
    const year = date.getFullYear();
    const years = Array.from({ length: 12 }, (_, i) => year - 5 + i);
    
    return (
        <Modal
        title="Calendar"
        size="xl"
        onBackdropClick={onClose}
        footer={
            <div className="w-full flex flex-wrap items-center justify-between">
                {undatedCount > 0 ? (
                    <span className="text-m text-gray-500">
                    {undatedCount} {undatedCount > 1 ? "tasks have" : "task has"} no due
                    date, so {undatedCount > 1 ? "they are" : "it is"} not shown here.
                    </span> 
                ): (
                   <span />
                )}
                <button
                    onClick={onClose}
                    className="cursor-pointer rounded-lg 
                    border border-gray-300 px-4 py-2 
                    text-base hover:bg-gray-50">
                Close
                </button>
            </div>
            
        }>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className=" flex gap-4 text-sm">
                {CATEGORIES.map(c => (
                <span key={c} className=" flex items-center gap-1.5">
                    <span
                    className="inline-block h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: CATEGORY_HEX[c] }}
                    />
                    {c}
                </span>
                ))}
            </div>

            <div className="flex gap-2 items-center">
                <button type="button" className={selectClass}
                    onClick={() => setDate(new Date())}>
                    Today
                </button>
                <button type="button" className={selectClass} aria-label="Previous month"
                    onClick={() => setDate(dayjs(date).subtract(1, "month").toDate())}>
                    &lt;
                </button>
                
                <select
                    value={date.getMonth()}
                    onChange={e => setDate(new Date(year, Number(e.target.value), 1))}
                    className={selectClass}>
                    {MONTHS.map((m, i) => (
                    <option key={m} value={i}>{m}</option>
                    ))}
                </select>
                <select
                    value={year}
                    onChange={e => setDate(new Date(Number(e.target.value), date.getMonth(), 1))}
                    className={selectClass}>
                    {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                    ))}
                </select>
                <button type="button" className={selectClass} aria-label="Next month"
                    onClick={() => setDate(dayjs(date).add(1, "month").toDate())}>
                    &gt;
                </button>
            </div>
        </div>
        
        <Calendar
            localizer={localizer}
            events={events}
            components={{toolbar:() => null}}
            startAccessor="start"
            endAccessor="end"
            views={["month"]}
            date={date}
            onNavigate={setDate}
            onShowMore={(dayEvents, d) =>
                setDayList({ date: d, tasks: dayEvents.map(e => e.task) })
            }
            eventPropGetter={event => ({
            style: {
                backgroundColor: CATEGORY_HEX[event.task.category],
                textDecoration: event.task.completed ? "line-through" : "none",
                opacity: event.task.completed ? 0.6 : 1,
            },
            })}
            style={{ height: 520 }}
        />
        {dayList && (
            <div className="mt-3 rounded-lg border border-gray-200 p-3 text-sm">
                <div className="mb-2 flex items-center justify-between">
                    <b>
                        {dayjs(dayList.date).format("D MMMM YYYY")}{" "}
                        ({dayList.tasks.length} {dayList.tasks.length > 1 ? "tasks" : "task"})
                    </b>
                    <button
                    onClick={() => setDayList(null)}
                    className="cursor-pointer text-gray-400 hover:text-gray-700"
                    >
                    x
                    </button>
                </div>
                <ul className="grid grid-flow-col grid-rows-3 auto-cols-max gap-x-8 gap-y-1 overflow-x-auto">
                    {dayList.tasks.map(t => (
                    <li key={t.id} className="flex items-center gap-2">
                        <span
                        className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: CATEGORY_HEX[t.category] }}
                        />
                        <span className={t.completed ? "text-gray-400 line-through" : ""}>
                        {t.title}
                        </span>
                    </li>
                    ))}
                </ul>
            </div>
        )}
        </Modal>
    );
}