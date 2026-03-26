import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyWinnings, uploadProof, type Winner } from "../api/winnerApi";
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";

const MyWinnings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [winnings, setWinnings] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingWinnerId, setUploadingWinnerId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMyWinnings();
  }, [user, navigate]);

  const fetchMyWinnings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyWinnings();
      setWinnings(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch winnings");
    } finally {
      setLoading(false);
    }
  };

  const handleProofUpload = async (winnerId: string) => {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    try {
      setUploadingWinnerId(winnerId);
      setError(null);
      await uploadProof(winnerId, selectedFile);
      setSelectedFile(null);
      await fetchMyWinnings();
      alert("Proof uploaded successfully!");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to upload proof");
    } finally {
      setUploadingWinnerId(null);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 py-10">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-emerald-900 mb-2">My Winnings</h1>
        <p className="text-gray-600 mb-8">Track your golf draw wins and manage your prizes</p>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {winnings.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-emerald-200 bg-white p-8 text-center">
            <p className="text-gray-500 text-lg">No winnings yet. Keep playing and scoring!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {winnings.map((winning) => (
              <div key={winning.id} className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left side: Details */}
                  <div>
                    <h3 className="text-xl font-semibold text-emerald-900 mb-4">Draw #{winning.draw_id.substring(0, 8)}</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Matched Numbers:</span>
                        <span className="font-semibold text-emerald-700">{winning.matched_numbers}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prize Amount:</span>
                        <span className="font-semibold text-emerald-700">${winning.prize_amount.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(winning.status)}`}>
                          {winning.status.charAt(0).toUpperCase() + winning.status.slice(1)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Payment:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentBadgeColor(winning.payment_status)}`}>
                          {winning.payment_status === "paid" ? "✓ Paid" : "Pending"}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500">
                        Won on: {new Date(winning.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Right side: Proof upload */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">Winning Proof</h4>
                    
                    {winning.proof_url ? (
                      <div>
                        <img 
                          src={winning.proof_url} 
                          alt="Proof" 
                          className="w-full h-48 object-cover rounded-lg mb-3 border border-emerald-100"
                        />
                        <p className="text-sm text-green-600">✓ Proof uploaded</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setSelectedFile(e.target.files[0]);
                              }
                            }}
                            className="w-full cursor-pointer"
                            disabled={uploadingWinnerId !== null}
                          />
                          {selectedFile && (
                            <p className="text-sm text-gray-600 mt-2">Selected: {selectedFile.name}</p>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleProofUpload(winning.id)}
                          disabled={!selectedFile || uploadingWinnerId === winning.id}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-semibold py-2 rounded-lg transition"
                        >
                          {uploadingWinnerId === winning.id ? "Uploading..." : "Upload Proof"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWinnings;
