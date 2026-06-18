import Calendar from "./Calendar";
import Card from "./Card";

export default function TimeLine() {
  const today = new Date();

  return (
    <div className="flex-1">
      <Card>
        <Calendar year={today.getFullYear()} month={today.getMonth()} />
      </Card>
    </div>
  );
}
