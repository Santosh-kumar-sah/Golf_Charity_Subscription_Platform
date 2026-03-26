
import React from "react";

export interface Subscription {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
}

interface Props {
  subscription: Subscription;
  onSelect: (id: string) => void;
}

const SubscriptionCard: React.FC<Props> = ({ subscription, onSelect }) => {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition cursor-pointer">
      <h3 className="text-lg font-bold">{subscription.name}</h3>
      <p>Price: ${subscription.price}</p>
      <p>Duration: {subscription.durationMonths} month(s)</p>
      <button
        className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        onClick={() => onSelect(subscription.id)}
      >
        Select
      </button>
    </div>
  );
};

export default SubscriptionCard;