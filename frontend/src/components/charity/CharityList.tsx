import React from "react";
import { type Charity } from "../../api/charityApi";
import CharityCard from "./CharityCard";

interface Props {
  charities: Charity[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CharityList: React.FC<Props> = ({ charities, onEdit, onDelete }) => {
  if (charities.length === 0) {
    return <p className="text-gray-600">No charities found.</p>;
  }

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {charities.map((c) => (
        <CharityCard
          key={c.id}
          charity={c}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CharityList;
