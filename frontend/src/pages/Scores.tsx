import React, { useState } from "react";
import ScoreForm from "../components/scores/ScoreForm";
import ScoreList from "../components/scores/ScoreList";

const Scores: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-emerald-800">Score Submission</h1>
      <p className="mt-2 text-gray-600">
        Enter your latest scores and track performance over time.
      </p>

      <div className="mt-6 rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-emerald-800">Add score</h2>
        <div className="mt-4">
          <ScoreForm onScoreAdded={() => setRefreshKey((k) => k + 1)} />
        </div>
      </div>

      <div className="mt-6" key={refreshKey}>
        <ScoreList />
      </div>
    </div>
  );
};

export default Scores;
