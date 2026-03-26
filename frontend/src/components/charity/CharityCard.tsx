import React from "react";
import { type Charity } from "../../api/charityApi";

interface Props {
  charity: Charity;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CharityCard: React.FC<Props> = ({ charity, onEdit, onDelete }) => {
  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
      {charity.image_url ? (
        <img
          src={charity.image_url}
          alt={charity.name}
          className="h-24 w-full object-cover rounded-md"
        />
      ) : null}

      <h3 className="mt-3 text-lg font-semibold text-emerald-800">
        {charity.name}
      </h3>
      <p className="mt-2 text-sm text-gray-600">{charity.description}</p>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => onEdit(charity.id)}
          className="rounded-lg border border-emerald-200 px-3 py-1 text-emerald-700 hover:bg-emerald-50"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(charity.id)}
          className="rounded-lg border border-red-200 px-3 py-1 text-red-700 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CharityCard;
