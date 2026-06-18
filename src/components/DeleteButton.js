import React from "react";
import deleteIcon from "../assets/bin.png";

export default function DeleteButton({ onDelete }) {
  return (
    <button
      onClick={onDelete}
      className="p-2 hover:bg-red-100 rounded flex items-center gap-2"
    >
      <img src={deleteIcon} alt="delete" className="w-10 h-10" />
    </button>
  );
}
