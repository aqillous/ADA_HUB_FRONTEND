import AdminListPage from "../components/AdminListPage";

export default function NewsPage() {
  return (
    <AdminListPage
      title="News"
      fetchUrl="http://localhost:8000/allNews"
      deleteUrl="http://localhost:8000/admin/news"
      editUrl="http://localhost:8000/admin/news"
      addLink="/admin/news/add"
      editFields={[
        { name: "news_header", type: "text", label: "Header" },
        { name: "news_content", type: "textarea", label: "Content" },
      ]}
      renderItem={(news) => (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">
            {news.news_header || "Unnamed News"}
          </h2>
          <p className="text-gray-600">{news.news_content}</p>
        </div>
      )}
    />
  );
}
