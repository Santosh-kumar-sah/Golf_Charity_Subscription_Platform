import React from "react";
import SubscriptionCard, { type Subscription } from "./SubscriptionCard";

interface Props {
  onSubscriptionSelected: (id: string) => void;
}

const SubscriptionSelector: React.FC<Props> = ({ onSubscriptionSelected }) => {
  const subscriptions: Subscription[] = [
    { id: "monthly", name: "Monthly", price: 9.99, durationMonths: 1 },
    { id: "yearly", name: "Yearly", price: 79.99, durationMonths: 12 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subscriptions.map((sub) => (
        <SubscriptionCard
          key={sub.id}
          subscription={sub}
          onSelect={onSubscriptionSelected}
        />
      ))}
    </div>
  );
};

export default SubscriptionSelector;