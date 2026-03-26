import React, { useState, useContext } from "react";
import { addScore } from "../../api/scoreApi";
import { NotificationContext,type NotificationContextType } from "../../context/NotificationContext";

interface ScoreFormProps {
  onScoreAdded: () => void;
}

const ScoreForm: React.FC<ScoreFormProps> = ({ onScoreAdded }) => {
  const [score, setScore] = useState<number>(0);
  const { notify } = useContext<NotificationContextType>(NotificationContext); // ✅ typed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addScore(score, new Date().toISOString());
      notify("Score added successfully!", "success");
      setScore(0);
      onScoreAdded();
    } catch (err) {
      notify("Failed to add score", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4">
      <input
        type="number"
        value={score}
        onChange={(e) => setScore(Number(e.target.value))}
        className="border p-2 rounded"
        placeholder="Enter score"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Score
      </button>
    </form>
  );
};

export default ScoreForm;