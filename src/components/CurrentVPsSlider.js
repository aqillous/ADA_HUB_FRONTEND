import { useEffect, useState } from "react";
import Placeholder from "../assets/default-placeholder.png";
import API_BASE_URL from "../config";

export default function CurrentVPsSlider() {
  const [vps, setVps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/vps`)
      .then((res) => res.json())
      .then((data) => setVps(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Current VPs</h2>
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 animate-pulse">
              <div
                className="w-full bg-gray-200 rounded-2xl"
                style={{ aspectRatio: "3/4" }}
              />
              <div className="mt-3 h-5 bg-gray-200 rounded w-3/4 mx-auto" />
              <div className="mt-2 h-4 bg-gray-100 rounded w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Current VPs</h2>

      {vps.length === 0 ? (
        <p className="text-center text-gray-500 py-6">No VPs added yet.</p>
      ) : (
        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {vps.map((vp) => (
            <div
              key={vp.id}
              className="snap-start flex-shrink-0 text-center w-[75vw] sm:w-[45vw] md:w-[calc(33.333%-12px)]"
            >
              <img
                src={vp.image_url || Placeholder}
                alt={vp.name}
                className="w-full object-cover object-top rounded-2xl shadow-sm"
                style={{ aspectRatio: "3/4" }}
              />
              <p className="mt-3 text-sm md:text-lg font-bold text-gray-800">
                {vp.name}
              </p>
              <p className="text-xs md:text-base text-gray-500 mt-1">
                {vp.position}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
