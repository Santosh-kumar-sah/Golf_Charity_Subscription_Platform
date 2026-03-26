import React, { useState } from "react";
import { type Charity } from "../../api/charityApi";

interface Props {
  charity: Charity | null;
  isOpen: boolean;
  onClose: () => void;
  onContribute: (charityId: string, amount: number) => void;
}

const ContributionModal: React.FC<Props> = ({ charity, isOpen, onClose, onContribute }) => {
  const [amount, setAmount] = useState<number>(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !charity) return null;

  const handleContribute = async () => {
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onContribute(charity.id, amount);
      setAmount(50);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to process contribution");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="float-right text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>

        {/* Charity Image & Name */}
        {charity.image_url && (
          <img
            src={charity.image_url}
            alt={charity.name}
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
        )}

        <h2 className="text-2xl font-bold text-emerald-900">{charity.name}</h2>
        <p className="mt-2 text-gray-600 text-sm">{charity.description}</p>

        {/* Progress */}
        {charity.amountRaised !== undefined && charity.targetAmount !== undefined && (
          <div className="mt-4 bg-gray-100 p-3 rounded-lg">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold">
                {charity.targetAmount > 0 ? Math.round((charity.amountRaised / charity.targetAmount) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-3">
              <div
                className="bg-emerald-600 h-3 rounded-full transition-all"
                style={{
                  width: `${charity.targetAmount ? Math.min((charity.amountRaised / charity.targetAmount) * 100, 100) : 0}%`,
                }}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              ${charity.amountRaised?.toFixed(2) || "0.00"} raised of ${charity.targetAmount?.toFixed(2) || "0.00"}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Contribution Amount */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contribution Amount
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-emerald-700">$</span>
            <input
              type="number"
              min="1"
              step="5"
              value={amount}
              onChange={(e) => {
                setAmount(Number(e.target.value));
                setError(null);
              }}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter amount"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">Minimum contribution: $1</p>
        </div>

        {/* Quick Amount Buttons */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[10, 25, 50, 100].map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setAmount(preset);
                setError(null);
              }}
              className={`py-2 px-3 rounded-lg text-sm font-semibold transition ${
                amount === preset
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ${preset}
            </button>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleContribute}
            disabled={loading}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center"
          >
            {loading ? "Processing..." : `Contribute $${amount}`}
          </button>
        </div>

        {/* Info */}
        <p className="mt-4 text-xs text-gray-500 text-center">
          💳 Your contribution supports this cause directly
        </p>
      </div>
    </div>
  );
};

export default ContributionModal;
