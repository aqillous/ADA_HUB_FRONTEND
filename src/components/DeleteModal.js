export default function DeleteModal({ label, YesClick, NoClick }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] text-center animate-scaleIn">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Are you sure you want to delete this{" "}
          <span className="font-bold">{label}</span>?
        </h2>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={YesClick}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
          >
            Yes
          </button>

          <button
            onClick={NoClick}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition shadow-md"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
