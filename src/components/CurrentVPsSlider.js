import { useEffect, useState, useRef } from "react";
import Placeholder from "../assets/default-placeholder.png";
import API_BASE_URL from "../config";

export default function CurrentVPsSlider() {
  const [vps, setVps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/vps`)
      .then((res) => res.json())
      .then((data) => setVps(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (vps.length <= 3) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % (vps.length - 2));
    }, 3000);
    return () => clearInterval(timerRef.current);
  }, [vps]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Current VPs</h2>
        <div className="flex gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 animate-pulse">
              <div className="w-full h-[380px] bg-gray-200 rounded-2xl" />
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
        <div className="overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(calc(-${current} * (100% / 3 + 8px)))`,
            }}
          >
            {vps.map((vp) => (
              <div
                key={vp.id}
                className="flex-shrink-0 text-center"
                style={{ width: "calc(33.333% - 16px)" }}
              >
                <img
                  src={vp.image_url || Placeholder}
                  alt={vp.name}
                  className="w-full h-[380px] object-cover rounded-2xl shadow-sm"
                />
                <p className="mt-3 text-lg font-bold text-gray-800">
                  {vp.name}
                </p>
                <p className="text-base text-gray-500 mt-1">{vp.position}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dot indicators */}
      {vps.length > 3 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: vps.length - 2 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? "bg-blue-500 w-4" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
