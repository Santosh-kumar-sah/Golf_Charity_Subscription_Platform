import React from "react";
import { type Charity } from "../../api/charityApi";

interface Props {
  charity: Charity;
  onContribute?: (charityId: string) => void;
}

const UserCharityCard: React.FC<Props> = ({ charity, onContribute }) => {
  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-md hover:shadow-lg transition overflow-hidden">
      {/* Charity Image */}
      {charity.image_url ? (
        <div className="relative h-48 w-full overflow-hidden rounded-lg mb-4">
          <img
            src={charity.image_url}
            alt={charity.name}
            className="h-full w-full object-cover hover:scale-105 transition duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition" />
        </div>
      ) : (
        <div className="h-48 w-full rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center mb-4">
          <span className="text-emerald-600 text-3xl">🏛️</span>
        </div>
      )}

      {/* Charity Info */}
      <h3 className="text-xl font-bold text-emerald-900">{charity.name}</h3>
      <p className="mt-3 text-gray-600 text-sm line-clamp-3">{charity.description}</p>

      {/* Stats */}
      {charity.amountRaised !== undefined && charity.targetAmount !== undefined && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Raised</span>
            <span className="font-semibold text-emerald-700">
              ${charity.amountRaised?.toFixed(2) || "0.00"} / ${charity.targetAmount?.toFixed(2) || "0.00"}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all"
              style={{
                width: `${charity.targetAmount ? Math.min((charity.amountRaised / charity.targetAmount) * 100, 100) : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Contribute Button */}
      {onContribute && (
        <button
          onClick={() => onContribute(charity.id)}
          className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition shadow-md hover:shadow-lg"
        >
          🎁 Contribute to This Cause
        </button>
      )}
    </div>
  );
};

export default UserCharityCard;
