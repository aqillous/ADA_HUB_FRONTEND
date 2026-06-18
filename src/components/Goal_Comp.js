import { useEffect, useState } from "react";
import Card from "./Card";

function GoalComp() {
  const [data, setData] = useState({
    Approveds: 0,
    global_rank: "-",
    national_rank: "-",
  });

  const goal = 333;

  useEffect(() => {
    fetch("http://localhost:8000/lcData")
      .then((res) => res.json())
      .then(setData)
      .catch(console.log);
  }, []);

  const percentage = Math.round((data.Approveds / goal) * 100);

  return (
    <Card>
      <div className="text-center space-y-3">
        <h2 className="text-xl font-semibold">LC Goal Progress</h2>

        <div className="text-5xl font-bold">
          {data.Approveds} / {goal}
        </div>

        <div className="text-gray-500">{percentage}% completed</div>

        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-700"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-center gap-6 pt-2 text-sm text-gray-600">
          <div>🌍 Global Rank: {data.global_rank}</div>
          <div>🏆 National Rank: {data.national_rank}</div>
        </div>
      </div>
    </Card>
  );
}

export default GoalComp;
