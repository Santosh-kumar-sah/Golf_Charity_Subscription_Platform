import React, { useEffect, useState } from "react";
import { getScores, type Score } from "../../api/scoreApi";
import Loader from "../common/Loader";

const ScoreList: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchScores = async () => {
    try {
      const data = await getScores();
      setScores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch scores", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Scores</h2>
      <ul className="list-disc pl-5">
        {scores.map((s) => (
          <li key={s.id}>
            {s.played_at
              ? new Date(s.played_at).toLocaleString()
              : "—"}: {s.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScoreList;