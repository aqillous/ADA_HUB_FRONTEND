import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaNewspaper, FaArrowRight, FaRegCalendarAlt } from "react-icons/fa";
import Card from "./Card";
import API_BASE_URL from "../config";

export default function News() {
  const [news, setNews] = useState([]);
  const [expandedNews, setExpandedNews] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/allNews`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setNews)
      .catch(console.error);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const today = new Date();

    const diff = Math.floor((today - date) / (1000 * 60 * 60 * 24));

    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";

    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex-1">
      <Card>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div
              className="
              flex
              items-center
              gap-2
              text-blue-600
              font-semibold
            "
            >
              <FaNewspaper />
              Latest News
            </div>

            <h2
              className="
              text-3xl
              font-bold
              text-gray-900
              mt-1
            "
            >
              ADA Hub News
            </h2>
          </div>

          <div
            className="
            px-4
            py-2
            rounded-full
            bg-blue-50
          "
          >
            <span
              className="
              text-sm
              font-semibold
              text-blue-700
            "
            >
              {news.length} News
            </span>
          </div>
        </div>

        {/* Empty State */}
        {news.length === 0 && (
          <div
            className="
            text-center
            py-16
          "
          >
            <FaNewspaper
              className="
                mx-auto
                text-5xl
                text-gray-300
                mb-4
              "
            />

            <h3
              className="
              font-semibold
              text-gray-700
            "
            >
              No News Yet
            </h3>

            <p
              className="
              text-gray-500
              mt-1
            "
            >
              Check back later for updates.
            </p>
          </div>
        )}

        {/* News List */}
        <div className="space-y-4">
          {news.map((item) => {
            const isExpanded = expandedNews === item.id;

            return (
              <motion.div
                key={item.id}
                layout
                transition={{
                  duration: 0.25,
                }}
                className={`
                  border
                  rounded-2xl
                  overflow-hidden
                  bg-white
                  cursor-pointer
                  transition
                  ${
                    isExpanded
                      ? "border-blue-400 shadow-lg"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                  }
                `}
                onClick={() => setExpandedNews(isExpanded ? null : item.id)}
              >
                {/* News Preview */}

                <div className="p-5">
                  <div
                    className="
                    flex
                    justify-between
                    items-start
                  "
                  >
                    <div className="flex-1">
                      <h3
                        className="
                        text-lg
                        font-bold
                        text-gray-900
                      "
                      >
                        {item.news_header || "Untitled"}
                      </h3>

                      <div
                        className="
                        flex
                        items-center
                        gap-2
                        mt-2
                        text-sm
                        text-gray-500
                      "
                      >
                        <FaRegCalendarAlt />

                        {formatDate(item.created_at)}
                      </div>

                      {!isExpanded && (
                        <p
                          className="
                          mt-4
                          text-gray-600
                          leading-relaxed
                        "
                        >
                          {item.news_short ||
                            item.news_content?.slice(0, 130) + "..."}
                        </p>
                      )}
                    </div>

                    <motion.div
                      animate={{
                        rotate: isExpanded ? 90 : 0,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="
                        ml-5
                        text-blue-600
                        mt-2
                      "
                    >
                      <FaArrowRight />
                    </motion.div>
                  </div>
                </div>

                {/* Expanded Article */}

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      className="
        border-t
        border-gray-100
      "
                    >
                      <div
                        className="
        px-6
        pb-6
        pt-5
      "
                      >
                        {/* Article Content */}

                        <article
                          className="
            whitespace-pre-line
            text-gray-700
            text-[16px]
            leading-8
          "
                        >
                          {item.news_content}
                        </article>

                        {/* Bottom Meta */}

                        <div
                          className="
            mt-8
            pt-5
            border-t
            border-gray-100
            flex
            justify-between
            items-center
            text-sm
            text-gray-400
          "
                        >
                          <span>Published {formatDate(item.created_at)}</span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedNews(null);
                            }}
                            className="
              text-gray-500
              hover:text-blue-600
              transition
              font-medium
            "
                          >
                            Show less
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
