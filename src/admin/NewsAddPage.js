import { authFetch } from "../utils/AuthFetch";
import AddForm from "../components/AddForm";
import API_BASE_URL from "../config";

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
      name: "news_short",
      label: "Short Description",
      type: "textarea",
      placeholder: "Short preview shown in cards",
      required: true,
    },

    {
      name: "news_content",
      label: "Full Content",
      type: "textarea",
      placeholder: "Enter full article content",
      required: true,
    },
  ];

  const handleSubmit = async (values) => {
    const res = await authFetch(`${API_BASE_URL}/admin/news`, {
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
