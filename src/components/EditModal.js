export default function EditModal({ label, actionText, YesClick, NoClick }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[400px] text-center animate-scaleIn">
        <h2 className="text-lg font-semibold mb-4">
          {actionText} <span className="text-blue-600 font-bold">{label}</span>?
        </h2>

        <div className="flex justify-center gap-4 mt-5">
          <button
            onClick={YesClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow"
          >
            Yes
          </button>

          <button
            onClick={NoClick}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition shadow"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
