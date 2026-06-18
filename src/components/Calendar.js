import { useEffect, useState } from "react";
import API_BASE_URL from "../config";

export default function Calendar({ year, month }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/allCalendarEvents`)
      .then((res) => res.json())
      .then(setEvents)
      .catch(console.log);
  }, []);

  const today = new Date();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let firstDay = new Date(year, month, 1).getDay();
  if (firstDay === 0) firstDay = 7;
  firstDay -= 1;

  const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;

  const cells = Array.from({ length: totalCells }, (_, i) => {
    if (i < firstDay || i >= daysInMonth + firstDay) return null;
    return i - firstDay + 1;
  });

  const eventsByDay = events.reduce((acc, e) => {
    const d = new Date(e.event_date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(e);
    }
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-center font-bold text-lg mb-3">
        {new Date(year, month).toLocaleString("en-US", { month: "long" })}{" "}
        {year}
      </h2>

      <div className="grid grid-cols-7 text-center font-semibold mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          const isToday =
            day &&
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;

          return (
            <div
              key={i}
              className={`h-[90px] border rounded-lg p-1 flex flex-col text-sm 
              hover:bg-gray-100 transition ${
                isToday ? "bg-blue-100 border-blue-400" : ""
              }`}
            >
              {day && (
                <>
                  <span className="font-medium">{day}</span>
                  <div className="overflow-y-auto text-xs">
                    {eventsByDay[day]?.map((e) => (
                      <div
                        key={e.id}
                        className="bg-blue-200 rounded px-1 mt-1 truncate"
                      >
                        {e.event_name}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
