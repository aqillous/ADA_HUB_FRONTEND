export default function PageContainer({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">{children}</div>
    </div>
  );
}
