import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaTimes } from "react-icons/fa";
import API_BASE_URL from "../config";

const EVENT_COLORS = [
  {
    bg: "bg-blue-50",
    border: "border-blue-500",
    text: "text-blue-700",
  },
  {
    bg: "bg-green-50",
    border: "border-green-500",
    text: "text-green-700",
  },
  {
    bg: "bg-purple-50",
    border: "border-purple-500",
    text: "text-purple-700",
  },
  {
    bg: "bg-orange-50",
    border: "border-orange-500",
    text: "text-orange-700",
  },
];

function getEventColor(id) {
  return EVENT_COLORS[id % EVENT_COLORS.length];
}

export default function Calendar({ year, month }) {
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/allCalendarEvents`)
      .then((res) => res.json())
      .then(setEvents)
      .catch(console.error);
  }, []);

  const today = new Date();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let firstDay = new Date(year, month, 1).getDay();

  if (firstDay === 0) firstDay = 7;

  firstDay--;

  const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;

  const cells = Array.from({ length: totalCells }, (_, i) => {
    if (i < firstDay || i >= daysInMonth + firstDay) return null;

    return i - firstDay + 1;
  });

  const eventsByDay = useMemo(() => {
    const grouped = {};

    events.forEach((event) => {
      const d = new Date(event.event_date);

      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();

        if (!grouped[day]) grouped[day] = [];

        grouped[day].push(event);
      }
    });

    Object.values(grouped).forEach((list) =>
      list.sort((a, b) =>
        (a.event_time || "").localeCompare(b.event_time || ""),
      ),
    );

    return grouped;
  }, [events, year, month]);

  const monthEvents = Object.values(eventsByDay).flat().length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold">
            <FaCalendarAlt />
            Calendar
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {new Date(year, month).toLocaleString("en-US", {
              month: "long",
            })}{" "}
            {year}
          </h2>
        </div>

        <div className="px-4 py-2 rounded-full bg-blue-50">
          <span className="text-blue-700 text-sm font-semibold">
            {monthEvents} Events
          </span>
        </div>
      </div>
      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center mb-3">
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
          <div
            key={day}
            className="text-xs uppercase tracking-widest font-bold text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {" "}
        {cells.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-[96px]" />;
          }

          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;

          const dayEvents = eventsByDay[day] || [];

          const firstEvent = dayEvents[0];

          return (
            <motion.div
              key={day}
              whileHover={{
                y: -3,
                scale: 1.02,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              onClick={() => setSelectedDay(day)}
              className={`
                h-[90px]
                rounded-lg
                border
                p-2
                cursor-pointer
                flex
                flex-col
                transition-all
                duration-200
                overflow-hidden
                ${
                  isToday
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg"
                }
              `}
            >
              {/* Day Number */}

              <div className="flex justify-between items-start mb-2">
                <span
                  className={`font-bold text-sm ${
                    isToday ? "text-blue-600" : "text-gray-800"
                  }`}
                >
                  {day}
                </span>

                <div className="flex items-center gap-1">
                  {dayEvents.length > 0 && (
                    <div className="min-w-[18px] h-[18px] rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                      {dayEvents.length}
                    </div>
                  )}

                  {isToday && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>
              </div>

              {/* Events */}

              {firstEvent &&
                (() => {
                  const color = getEventColor(firstEvent.id);

                  return (
                    <div
                      className={`
        rounded-lg
        border-l-4
        ${color.border}
        ${color.bg}
        px-2
        py-1.5
      `}
                    >
                      <div
                        className={`flex items-center gap-1 text-[9px] font-bold ${color.text}`}
                      >
                        <FaClock className="text-[8px]" />
                        {firstEvent.event_time?.slice(0, 5)}
                      </div>

                      <div className="truncate text-[10px] font-semibold text-gray-700 mt-0.5">
                        {firstEvent.event_name}
                      </div>
                    </div>
                  );
                })()}
            </motion.div>
          );
        })}
      </div>{" "}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-5"
            onClick={() => setSelectedDay(null)}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 40,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 40,
                scale: 0.97,
              }}
              transition={{
                duration: 0.25,
              }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              {/* Header */}

              <div className="px-7 py-6 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="uppercase text-xs tracking-[3px] text-blue-100">
                      Schedule
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                      {new Date(year, month, selectedDay).toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "long",
                        },
                      )}
                    </h2>

                    <p className="text-blue-100 mt-1">
                      {eventsByDay[selectedDay]?.length || 0} Event
                      {(eventsByDay[selectedDay]?.length || 0) !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedDay(null)}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Timeline */}

              <div className="max-h-[450px] overflow-y-auto px-7 py-6">
                {(eventsByDay[selectedDay] || []).length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-3">📅</div>

                    <h3 className="font-semibold text-gray-700">No Events</h3>

                    <p className="text-gray-500 text-sm mt-1">
                      Nothing scheduled for this day.
                    </p>
                  </div>
                )}

                {(eventsByDay[selectedDay] || []).map((event, index) => {
                  const color = getEventColor(event.id);

                  return (
                    <div key={event.id} className="flex gap-5 group">
                      {/* Timeline */}

                      <div className="flex flex-col items-center">
                        <div
                          className={`
                            w-11
                            h-11
                            rounded-full
                            ${color.bg}
                            border-2
                            ${color.border}
                            flex
                            items-center
                            justify-center
                          `}
                        >
                          <FaClock className={color.text} />
                        </div>

                        {index !== eventsByDay[selectedDay].length - 1 && (
                          <div className="w-[2px] flex-1 bg-gray-200 my-2" />
                        )}
                      </div>

                      {/* Card */}

                      <div
                        className="
                          flex-1
                          rounded-2xl
                          border
                          border-gray-200
                          p-4
                          mb-5
                          transition-all
                          duration-200
                          group-hover:shadow-md
                          group-hover:border-blue-300
                        "
                      >
                        <div
                          className={`
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-bold
                            ${color.bg}
                            ${color.text}
                          `}
                        >
                          <FaClock />

                          {event.event_time?.slice(0, 5)}
                        </div>

                        <h3 className="mt-3 font-semibold text-gray-800 text-lg">
                          {event.event_name}
                        </h3>

                        {event.description && (
                          <p className="text-sm text-gray-500 mt-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
