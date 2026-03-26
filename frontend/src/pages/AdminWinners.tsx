import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getWinners, updateWinnerStatus, markPayment, type Winner } from "../api/winnerApi";
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";

const AdminWinners: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/dashboard");
      return;
    }
    fetchWinners();
  }, [user, navigate]);

  const fetchWinners = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWinners();
      setWinners(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch winners");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (winnerId: string) => {
    try {
      setProcessingId(winnerId);
      setError(null);
      await updateWinnerStatus(winnerId, "approved");
      await fetchWinners();
      alert("Winner approved!");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to approve winner");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (winnerId: string) => {
    try {
      setProcessingId(winnerId);
      setError(null);
      await updateWinnerStatus(winnerId, "rejected");
      await fetchWinners();
      alert("Winner rejected!");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reject winner");
    } finally {
      setProcessingId(null);
    }
  };

  const handleMarkPaid = async (winnerId: string) => {
    try {
      setProcessingId(winnerId);
      setError(null);
      await markPayment(winnerId);
      await fetchWinners();
      alert("Payment marked as paid!");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to mark payment");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredWinners = winners.filter((w) => {
    if (filterStatus === "all") return true;
    return w.status === filterStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentBadgeColor = (status: string) => {
    return status === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-800";
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-10">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-purple-900 mb-2">Winners Management</h1>
        <p className="text-gray-600 mb-8">Review and manage user winnings and payments</p>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-8 flex gap-3 flex-wrap">
          {(["all", "pending", "approved", "rejected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === status
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)} ({filteredWinners.filter(w => filterStatus === "all" ? true : w.status === filterStatus).length})
            </button>
          ))}
        </div>

        {filteredWinners.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-purple-200 bg-white p-8 text-center">
            <p className="text-gray-500 text-lg">No winners found in this category</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-purple-100 bg-white shadow-sm">
            <table className="w-full">
              <thead className="border-b border-purple-100 bg-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">Draw ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">Matched Numbers</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">Prize Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">Proof</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWinners.map((winner) => (
                  <tr key={winner.id} className="border-b border-purple-50 hover:bg-purple-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-800 font-mono">{winner.draw_id.substring(0, 8)}</td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-mono">{winner.user_id.substring(0, 8)}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-700">{winner.matched_numbers}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-700">${winner.prize_amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(winner.status)}`}>
                        {winner.status.charAt(0).toUpperCase() + winner.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPaymentBadgeColor(winner.payment_status)}`}>
                        {winner.payment_status === "paid" ? "✓ Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {winner.proof_url ? (
                        <a
                          href={winner.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">No proof</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {winner.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(winner.id)}
                              disabled={processingId !== null}
                              className="text-xs bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-2 py-1 rounded transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(winner.id)}
                              disabled={processingId !== null}
                              className="text-xs bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white px-2 py-1 rounded transition"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {winner.status === "approved" && winner.payment_status === "unpaid" && (
                          <button
                            onClick={() => handleMarkPaid(winner.id)}
                            disabled={processingId !== null}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-2 py-1 rounded transition"
                          >
                            Mark Paid
                          </button>
                        )}
                        {winner.status === "approved" && winner.payment_status === "paid" && (
                          <span className="text-xs text-gray-500">✓ Completed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWinners;
