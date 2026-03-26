import React, { useEffect, useState } from "react";
import { getPublicDraws, type Draw } from "../api/drawApi";
import Loader from "../components/common/Loader";

const Draws: React.FC = () => {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDraws = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const data = await getPublicDraws();
        setDraws(data);
      } catch (err: any) {
        setErrorMessage("Failed to load draws.");
        console.error("Failed to load draws", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDraws();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-emerald-800">Draw Participation</h1>
      <p className="mt-2 text-gray-600">
        Explore upcoming draws. You must be logged in to view them.
      </p>

      {errorMessage ? (
        <p className="mt-4 text-gray-600">{errorMessage}</p>
      ) : draws.length === 0 ? (
        <p className="mt-4 text-gray-600">No draws available.</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {draws.map((d) => (
            <div
              key={d.id}
              className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-emerald-800">
                {d.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {new Date(d.date).toLocaleDateString()}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Prize: ${d.prizeAmount}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Draws;
