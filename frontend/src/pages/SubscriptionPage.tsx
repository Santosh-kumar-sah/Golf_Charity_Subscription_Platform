import React, { useContext, useEffect, useState } from "react";
import { createSubscription, cancelSubscription, getMySubscription, type Subscription } from "../api/subscriptionApi";
import SubscriptionSelector from "../components/subscription/SubscriptionSelector";
import Loader from "../components/common/Loader";
import { NotificationContext, type NotificationContextType } from "../context/NotificationContext";

const SubscriptionPage: React.FC = () => {
  const { notify } = useContext<NotificationContextType>(NotificationContext);

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const sub = await getMySubscription();
        setSubscription(sub);
      } catch (err: any) {
        // Backend returns 404 when no subscription exists
        setSubscription(null);
        console.error("No subscription found", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handlePlanSelected = async (planId: string) => {
    setActionLoading(true);
    try {
      const plan = planId as "monthly" | "yearly";
      const sub = await createSubscription(plan);
      setSubscription(sub);
      notify("Subscription created successfully", "success");
    } catch (err: any) {
      notify(err?.response?.data?.message || "Failed to create subscription", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!subscription?.id) return;
    setActionLoading(true);
    try {
      const sub = await cancelSubscription(subscription.id);
      setSubscription(sub);
      notify("Subscription cancelled", "success");
    } catch (err: any) {
      notify(err?.response?.data?.message || "Failed to cancel subscription", "error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-emerald-800">Subscription</h1>

      <section className="mt-6 rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-emerald-800">Your plan</h2>
        {!subscription ? (
          <p className="mt-2 text-gray-600">You don’t have an active subscription yet.</p>
        ) : (
          <div className="mt-3 space-y-2 text-gray-700">
            <div>
              <span className="font-semibold">Plan:</span> {subscription.plan}
            </div>
            <div>
              <span className="font-semibold">Status:</span> {subscription.status}
            </div>
            <div>
              <span className="font-semibold">Start:</span>{" "}
              {new Date(subscription.start_date).toLocaleDateString()}
            </div>
            <div>
              <span className="font-semibold">End:</span>{" "}
              {new Date(subscription.end_date).toLocaleDateString()}
            </div>

            {subscription.status === "active" && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleCancel}
                className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {actionLoading ? "Cancelling..." : "Cancel subscription"}
              </button>
            )}
          </div>
        )}
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-emerald-800">Choose a plan</h2>
        <div className="mt-4">
          <SubscriptionSelector onSubscriptionSelected={(id) => handlePlanSelected(id)} />
        </div>
      </section>
    </div>
  );
};

export default SubscriptionPage;
