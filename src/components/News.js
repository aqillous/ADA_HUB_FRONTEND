import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import API_BASE_URL from "../config";

export default function News() {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/allNews`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setNews)
      .catch(console.log);
  }, [navigate]);

  return (
    <div className="flex-1">
      <Card>
        <h2 className="text-center text-xl font-bold mb-4">News</h2>

        {news.length === 0 ? (
          <p className="text-center text-gray-500">No news yet</p>
        ) : (
          <div className="space-y-3">
            {news.map((item) => (
              <div
                key={item.id}
                className="p-3 border rounded-xl hover:shadow-md transition bg-gray-50"
              >
                <h3 className="font-semibold">
                  {item.news_header || "Untitled"}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {item.news_content}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
