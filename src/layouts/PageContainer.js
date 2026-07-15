export default function PageContainer({ children }) {
  return (
    <div className="relative min-h-screen bg-cream-50 bg-app-glow overflow-hidden">
      {/* Faint dot-grid texture for depth — sits under everything */}
      <div
        className="absolute inset-0 bg-dot-grid bg-grid opacity-60 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">{children}</div>
      </div>
    </div>
  );
}
