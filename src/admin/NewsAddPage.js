import { authFetch } from "../utils/AuthFetch";
import AddForm from "../components/AddForm";

export default function NewsAddPage() {
  const fields = [
    {
      name: "news_header",
      label: "News Header",
      type: "text",
      placeholder: "Enter header",
      required: true,
    },
    {
      name: "news_content",
      label: "News Content",
      type: "textarea",
      placeholder: "Enter content",
      required: true,
    },
  ];

  const handleSubmit = async (values) => {
    const res = await authFetch("http://localhost:8000/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Error adding news");
    return { message: `News added! ID: ${data.news.id}` };
  };

  return (
    <AddForm
      fields={fields}
      onSubmit={handleSubmit}
      backLink="/admin/news"
      title="Add News"
    />
  );
}
