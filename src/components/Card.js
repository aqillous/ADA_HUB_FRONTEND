export default function Card({ children }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5">
      {children}
    </div>
  );
}
