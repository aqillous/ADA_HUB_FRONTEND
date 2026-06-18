import EditIcon from "../assets/pen.png";

export default function EditButton({ onEdit }) {
  return (
    <button
      onClick={onEdit}
      className="p-2 hover:bg-blue-100 rounded flex items-center gap-2"
    >
      <img src={EditIcon} alt="edit" className="w-10 h-10" />
    </button>
  );
}
