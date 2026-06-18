import { authFetch } from "../utils/AuthFetch";
import AddForm from "../components/AddForm";
import API_BASE_URL from "../config";

export default function CalendarAddPage() {
  const fields = [
    {
      name: "event_name",
      label: "Event Name",
      type: "text",
      placeholder: "Enter event name",
      required: true,
    },
    {
      name: "event_date",
      label: "Event Date",
      type: "date",
      placeholder: "",
      required: true,
    },
    {
      name: "event_time",
      label: "Event Time",
      type: "time",
      placeholder: "",
      required: true,
    },
  ];

  const handleSubmit = async (values) => {
    const res = await authFetch(`${API_BASE_URL}/admin/calEvent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error adding event");
    return { message: `Event added! ID: ${data.event.id}` };
  };

  return (
    <AddForm
      fields={fields}
      onSubmit={handleSubmit}
      backLink="/admin/calendar"
      title="Add Calendar Event"
    />
  );
}
