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
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h2 className="text-xl font-bold mb-4 text-center">Current VPs</h2>
        <div className="flex gap-4 overflow-x-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-shrink-0 w-60 animate-pulse">
              <div className="w-full h-[250px] bg-gray-200 rounded-xl" />
              <div className="mt-2 h-4 bg-gray-200 rounded w-3/4 mx-auto" />
              <div className="mt-1 h-3 bg-gray-100 rounded w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <h2 className="text-xl font-bold mb-4 text-center">Current VPs</h2>

      {vps.length === 0 ? (
        <p className="text-center text-gray-500 py-6">No VPs added yet.</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto snap-x pb-2">
          {vps.map((vp) => (
            <div
              key={vp.id}
              className="snap-start flex-shrink-0 w-60 text-center hover:scale-105 transition"
            >
              <img
                src={vp.image_url || Placeholder}
                alt={vp.name}
                className="w-full h-[250px] object-cover rounded-xl"
              />
              <p className="mt-2 font-semibold text-gray-800">{vp.name}</p>
              <p className="text-sm text-gray-500">{vp.position}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
