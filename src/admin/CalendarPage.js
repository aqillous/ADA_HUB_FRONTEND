import AdminListPage from "../components/AdminListPage";
import API_BASE_URL from "../config";

export default function CalendarListPage() {
  return (
    <AdminListPage
      title="Calendar Events"
      fetchUrl={`${API_BASE_URL}/allCalendarEvents`}
      deleteUrl={`${API_BASE_URL}/admin/calEvent`}
      editUrl={`${API_BASE_URL}/admin/calEvent`}
      addLink="/admin/calendar/add"
      // structured fields with input types
      editFields={[
        { name: "event_name", type: "text", label: "Event Name" },
        { name: "event_date", type: "date", label: "Event Date" },
        { name: "event_time", type: "time", label: "Event Time" },
      ]}
      renderItem={(event) => (
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">
            {event.event_name || "Unnamed Event"}
          </h2>
          <p className="text-gray-600">
            {event.event_date} at {event.event_time}
          </p>
        </div>
      )}
    />
  );
}
