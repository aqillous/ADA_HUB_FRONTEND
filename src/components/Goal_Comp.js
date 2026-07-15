import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBullseye, FaGlobeEurope, FaTrophy } from "react-icons/fa";

import Card from "./Card";
import API_BASE_URL from "../config";

function GoalComp() {
  const [data, setData] = useState({
    Approveds: 0,
    global_rank: "-",
    national_rank: "-",
  });

  const goal = 333;

  useEffect(() => {
    fetch(`${API_BASE_URL}/lcData`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const percentage = Math.min(Math.round((data.Approveds / goal) * 100), 100);

  const progressColor = () => {
    if (percentage < 30) return "from-red-500 to-red-600";

    if (percentage < 60) return "from-orange-400 to-orange-500";

    if (percentage < 90) return "from-blue-500 to-indigo-600";

    return "from-green-500 to-emerald-600";
  };

  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      transition={{
        duration: 0.25,
      }}
    >
      <Card>
        <div className="relative overflow-hidden">
          {/* Background */}

          <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-blue-100 opacity-30 blur-3xl" />

          <div className="space-y-6">
            {/* Header */}

            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  <FaBullseye />

                  <span>LC Goal Progress</span>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  Current performance toward annual goal
                </p>
              </div>
            </div>

            {/* Numbers */}

            <div className="flex items-end justify-center gap-4">
              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="text-center"
              >
                <h1 className="text-6xl font-black tracking-tight text-gray-900">
                  {data.Approveds}
                </h1>

                <p className="text-gray-500 font-medium">Approveds</p>
              </motion.div>

              <div className="pb-3 text-4xl font-light text-gray-400">/</div>

              <div className="pb-4 text-center">
                <div className="text-3xl font-bold text-gray-700">{goal}</div>

                <p className="text-gray-500">Goal</p>
              </div>
            </div>

            {/* Progress */}

            <div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-500">Progress</span>

                <div className="px-4 py-2 rounded-full bg-blue-50 border border-blue-100">
                  <span className="text-blue-700 font-bold">{percentage}%</span>
                </div>
              </div>

              <div className="h-5 rounded-full bg-gray-200 overflow-hidden shadow-inner">
                <motion.div
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${percentage}%`,
                  }}
                  transition={{
                    duration: 1,
                  }}
                  className={`h-full bg-gradient-to-r ${progressColor()} rounded-full relative`}
                >
                  <div className="absolute inset-0 bg-white/10"></div>
                </motion.div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <div className="grid grid-cols-2 gap-4">
                {" "}
                {/* Global Rank */}
                <motion.div
                  whileHover={{
                    y: -4,
                    scale: 1.02,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Global Rank</p>

                      <h2 className="text-3xl font-bold text-gray-900 mt-1">
                        #{data.global_rank}
                      </h2>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <FaGlobeEurope className="text-blue-600 text-xl" />
                    </div>
                  </div>
                </motion.div>
                {/* National Rank */}
                <motion.div
                  whileHover={{
                    y: -4,
                    scale: 1.02,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="rounded-2xl border border-yellow-100 bg-gradient-to-br from-yellow-50 to-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">National Rank</p>

                      <h2 className="text-3xl font-bold text-gray-900 mt-1">
                        #{data.national_rank}
                      </h2>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                      <FaTrophy className="text-yellow-500 text-xl" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default GoalComp;
