import React, { useEffect, useState } from "react";
import Loader from "../components/common/Loader";
import CharityList from "../components/charity/CharityList";
import {
  createCharity,
  deleteCharity,
  getCharities,
  updateCharity,
  type Charity,
} from "../api/charityApi";
import {
  calculatePrizePool,
  getAllDraws,
  getDrawResults,
  getPrizePools,
  publishDraw,
  simulateDraw,
  type AdminDraw,
  type AdminDrawSimulationResult,
  type DrawResult,
  type PrizePool,
} from "../api/drawApi";

const AdminPanel: React.FC = () => {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [charitiesLoading, setCharitiesLoading] = useState(true);
  const [charitiesError, setCharitiesError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [drawsLoading, setDrawsLoading] = useState(false);
  const [drawsError, setDrawsError] = useState<string | null>(null);
  const [draws, setDraws] = useState<AdminDraw[]>([]);
  const [simLoading, setSimLoading] = useState(false);
  const [lastSimulation, setLastSimulation] = useState<AdminDrawSimulationResult | null>(null);

  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState<string | null>(null);
  const [results, setResults] = useState<DrawResult[]>([]);

  const [poolsLoading, setPoolsLoading] = useState(false);
  const [poolsError, setPoolsError] = useState<string | null>(null);
  const [prizePools, setPrizePools] = useState<PrizePool[]>([]);

  useEffect(() => {
    const fetchCharities = async () => {
      setCharitiesLoading(true);
      setCharitiesError(null);
      try {
        const data = await getCharities();
        setCharities(data);
      } catch (err: any) {
        setCharitiesError(
          err?.response?.status === 403
            ? "Admin access required to view charities."
            : "Failed to load admin data."
        );
      } finally {
        setCharitiesLoading(false);
      }
    };

    fetchCharities();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setImageFile(null);
  };

  const handleEdit = (id: string) => {
    const c = charities.find((x) => x.id === id);
    if (!c) return;
    setEditingId(id);
    setName(c.name);
    setDescription(c.description);
    setImageFile(null);
  };

  const refreshCharities = async () => {
    setCharitiesLoading(true);
    setCharitiesError(null);
    try {
      const data = await getCharities();
      setCharities(data);
    } catch (err: any) {
      setCharitiesError(
        err?.response?.status === 403
          ? "Admin access required to view charities."
          : "Failed to load charities."
      );
    } finally {
      setCharitiesLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // eslint-disable-next-line no-alert
    const ok = window.confirm("Delete this charity? This cannot be undone.");
    if (!ok) return;

    try {
      await deleteCharity(id);
      resetForm();
      await refreshCharities();
    } catch (err: any) {
      setCharitiesError(err?.response?.data?.message || "Failed to delete charity.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setCharitiesError(null);

    if (!name.trim() || !description.trim()) {
      setCharitiesError("Name and description are required.");
      return;
    }

    try {
      if (editingId) {
        await updateCharity(editingId, {
          name: name.trim(),
          description: description.trim(),
          imageFile,
        });
      } else {
        await createCharity({
          name: name.trim(),
          description: description.trim(),
          imageFile,
        });
      }
      resetForm();
      await refreshCharities();
    } catch (err: any) {
      setCharitiesError(err?.response?.data?.message || "Failed to save charity.");
    }
  };

  const refreshDraws = async () => {
    setDrawsLoading(true);
    setDrawsError(null);
    try {
      const data = await getAllDraws();
      setDraws(data);
    } catch (err: any) {
      setDrawsError(err?.response?.data?.message || "Failed to load draws.");
    } finally {
      setDrawsLoading(false);
    }
  };

  useEffect(() => {
    refreshDraws();
  }, []);

  const refreshResults = async () => {
    setResultsLoading(true);
    setResultsError(null);
    try {
      const data = await getDrawResults();
      setResults(data);
    } catch (err: any) {
      setResultsError(err?.response?.data?.message || "Failed to load draw results.");
    } finally {
      setResultsLoading(false);
    }
  };

  const refreshPools = async () => {
    setPoolsLoading(true);
    setPoolsError(null);
    try {
      const data = await getPrizePools();
      setPrizePools(data);
    } catch (err: any) {
      setPoolsError(err?.response?.data?.message || "Failed to load prize pools.");
    } finally {
      setPoolsLoading(false);
    }
  };

  const handleSimulate = async () => {
    setSimLoading(true);
    setDrawsError(null);
    try {
      const res = await simulateDraw();
      setLastSimulation(res);
      await refreshDraws();
    } catch (err: any) {
      setDrawsError(err?.response?.data?.message || "Failed to simulate draw.");
    } finally {
      setSimLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    setDrawsError(null);
    try {
      await publishDraw(id);
      await refreshDraws();
    } catch (err: any) {
      setDrawsError(err?.response?.data?.message || "Failed to publish draw.");
    }
  };

  const handleCalculatePool = async (draw_id: string) => {
    setPoolsError(null);
    try {
      await calculatePrizePool(draw_id);
      await refreshPools();
    } catch (err: any) {
      setPoolsError(err?.response?.data?.message || "Failed to calculate prize pool.");
    }
  };

  // Charities loading is separate; still render if draws are ready.
  if (charitiesLoading) return <Loader />;

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-emerald-800">Admin Panel</h1>
      <p className="mt-2 text-gray-600">
        Manage platform data and review charities.
      </p>

      {(charitiesError || drawsError || resultsError || poolsError) && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
          {charitiesError || drawsError || resultsError || poolsError}
        </div>
      )}

      <section className="mt-8 rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-emerald-800">Charity CRUD</h2>

        <form onSubmit={handleSave} className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:border-emerald-400 focus:outline-none"
              placeholder="Charity name"
              required
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="mt-1 w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 min-h-[110px] w-full rounded-lg border px-3 py-2 focus:border-emerald-400 focus:outline-none"
              placeholder="Short description"
              required
            />
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800"
            >
              {editingId ? "Update Charity" : "Create Charity"}
            </button>

            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-emerald-200 px-4 py-2 text-emerald-800 hover:bg-emerald-50"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <h3 className="mt-8 text-lg font-semibold text-emerald-800">
          Existing charities
        </h3>

        {charitiesLoading ? (
          <Loader />
        ) : (
          <CharityList
            charities={charities}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </section>

      <section className="mt-10 rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-emerald-800">
          Draw Simulation & Publish
        </h2>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={simLoading}
            onClick={handleSimulate}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800 disabled:opacity-60"
          >
            {simLoading ? "Simulating..." : "Simulate Next Draw"}
          </button>

          <button
            type="button"
            onClick={refreshDraws}
            disabled={drawsLoading}
            className="rounded-lg border border-emerald-200 px-4 py-2 text-emerald-800 hover:bg-emerald-50 disabled:opacity-60"
          >
            {drawsLoading ? "Loading..." : "Refresh Draws"}
          </button>

          <button
            type="button"
            onClick={refreshResults}
            disabled={resultsLoading}
            className="rounded-lg border border-emerald-200 px-4 py-2 text-emerald-800 hover:bg-emerald-50 disabled:opacity-60"
          >
            {resultsLoading ? "Loading..." : "Refresh Results"}
          </button>

          <button
            type="button"
            onClick={refreshPools}
            disabled={poolsLoading}
            className="rounded-lg border border-emerald-200 px-4 py-2 text-emerald-800 hover:bg-emerald-50 disabled:opacity-60"
          >
            {poolsLoading ? "Loading..." : "Refresh Prize Pools"}
          </button>
        </div>

        {lastSimulation ? (
          <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-emerald-900">
            Simulated draw for{" "}
            <span className="font-semibold">
              {String(lastSimulation.draw.draw_date ?? "")}
            </span>
            . Winners:{" "}
            <span className="font-semibold">
              {lastSimulation.winners.length}
            </span>
            .
          </div>
        ) : null}

        <div className="mt-6">
          {drawsLoading ? (
            <Loader />
          ) : draws.length === 0 ? (
            <p className="text-gray-600">No draws found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 pr-4 text-sm font-medium text-gray-600">
                      Date
                    </th>
                    <th className="py-2 pr-4 text-sm font-medium text-gray-600">
                      Numbers
                    </th>
                    <th className="py-2 pr-4 text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {draws.map((d) => (
                    <tr key={d.id} className="border-b border-gray-100">
                      <td className="py-2 pr-4 text-sm text-gray-800">
                        {String(d.draw_date ?? "")}
                      </td>
                      <td className="py-2 pr-4 text-sm text-gray-700">
                        {typeof d.numbers === "string"
                          ? d.numbers
                          : JSON.stringify(d.numbers ?? [])}
                      </td>
                      <td className="py-2 pr-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handlePublish(d.id)}
                            className="rounded-lg border border-emerald-200 px-3 py-1 text-emerald-800 hover:bg-emerald-50"
                          >
                            Publish
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCalculatePool(d.id)}
                            className="rounded-lg bg-emerald-700 px-3 py-1 text-white hover:bg-emerald-800"
                          >
                            Calc Prize Pool
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-emerald-800">
              Prize Pools
            </h3>
            {poolsLoading ? (
              <Loader />
            ) : prizePools.length === 0 ? (
              <p className="mt-2 text-gray-600">
                No prize pools loaded. Click “Refresh Prize Pools”.
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                {prizePools.map((p) => (
                  <div
                    key={p.id ?? `${p.draw_id}-${p.created_at ?? ""}`}
                    className="rounded-lg border border-emerald-100 bg-white p-4"
                  >
                    <div className="text-sm text-gray-700">
                      Draw ID:{" "}
                      <span className="font-semibold">{p.draw_id}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      Total:{" "}
                      <span className="font-semibold">{p.total_pool}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-700">
                      Match 5:{" "}
                      <span className="font-semibold">{p.match_5}</span> | Match 4:{" "}
                      <span className="font-semibold">{p.match_4}</span> | Match 3:{" "}
                      <span className="font-semibold">{p.match_3}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-emerald-800">
              Draw Results
            </h3>
            {resultsLoading ? (
              <Loader />
            ) : results.length === 0 ? (
              <p className="mt-2 text-gray-600">
                No results loaded. Click “Refresh Results”.
              </p>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-2 pr-4 text-sm font-medium text-gray-600">
                        Draw ID
                      </th>
                      <th className="py-2 pr-4 text-sm font-medium text-gray-600">
                        User
                      </th>
                      <th className="py-2 pr-4 text-sm font-medium text-gray-600">
                        Matches
                      </th>
                      <th className="py-2 pr-4 text-sm font-medium text-gray-600">
                        Prize
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr key={r.id} className="border-b border-gray-100">
                        <td className="py-2 pr-4 text-sm text-gray-800">
                          {r.draw_id}
                        </td>
                        <td className="py-2 pr-4 text-sm text-gray-700">
                          {r.user_id}
                        </td>
                        <td className="py-2 pr-4 text-sm text-gray-700">
                          {r.matched_numbers}
                        </td>
                        <td className="py-2 pr-4 text-sm text-gray-700">
                          {r.prize_amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
