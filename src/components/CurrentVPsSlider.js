import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaUsers } from "react-icons/fa";
import Placeholder from "../assets/default-placeholder.png";
import API_BASE_URL from "../config";

export default function CurrentVPsSlider() {
  const [vps, setVps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [start, setStart] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE_URL}/vps`)
      .then((res) => res.json())
      .then((data) => setVps(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const next = () => {
    if (start < vps.length - 3) {
      setStart(start + 1);
    }
  };

  const previous = () => {
    if (start > 0) {
      setStart(start - 1);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm p-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-6" />

        <div className="grid grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="
                aspect-[3/4]
                rounded-3xl
                bg-gray-200
                animate-pulse
              "
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="
      bg-white
      rounded-3xl
      shadow-sm
      p-6
    "
    >
      {/* Header */}

      <div
        className="
        flex
        justify-between
        items-center
        mb-7
      "
      >
        <div>
          <div
            className="
            flex
            items-center
            gap-2
            text-blue-600
            font-semibold
            text-sm
          "
          >
            <FaUsers />
            Current Executive Board
          </div>

          <h2
            className="
            text-3xl
            font-bold
            text-gray-900
            mt-1
          "
          >
            EB Valyria
          </h2>
        </div>

        {/* Controls */}

        {vps.length > 3 && (
          <div className="flex gap-2">
            <button
              onClick={previous}
              disabled={start === 0}
              className="
                w-10
                h-10
                rounded-full
                border
                flex
                items-center
                justify-center
                hover:bg-gray-100
                disabled:opacity-40
              "
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={next}
              disabled={start >= vps.length - 3}
              className="
                w-10
                h-10
                rounded-full
                bg-blue-600
                text-white
                flex
                items-center
                justify-center
                hover:bg-blue-700
                disabled:opacity-40
              "
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Cards */}

      <div
        className="
        overflow-hidden
      "
      >
        <motion.div
          animate={{
            x: `-${start * 33.333}%`,
          }}
          transition={{
            duration: 0.4,
          }}
          className="
            flex
            gap-5
          "
        >
          {vps.map((vp) => (
            <motion.div
              key={vp.id}
              whileHover={{
                y: -6,
              }}
              className="
                relative
                flex-shrink-0
                w-full
                sm:w-[calc(50%-10px)]
                lg:w-[calc(33.333%-14px)]
                aspect-[3/4]
                rounded-3xl
                overflow-hidden
                shadow-md
              "
            >
              <img
                src={vp.image_url || Placeholder}
                alt={vp.name}
                className="
                  w-full
                  h-full
                  object-cover
                  object-top
                "
              />

              {/* Gradient */}

              <div
                className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/70
                via-black/10
                to-transparent
              "
              />

              {/* Info */}

              <div
                className="
                absolute
                bottom-0
                left-0
                right-0
                p-5
                text-white
              "
              >
                <h3
                  className="
                  text-xl
                  font-bold
                "
                >
                  {vp.name}
                </h3>

                <p
                  className="
                  text-sm
                  text-gray-200
                  mt-1
                "
                >
                  {vp.position}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
