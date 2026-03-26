import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { type Charity, getCharities } from "../api/charityApi";
import { type Draw, getPublicDraws } from "../api/drawApi";
import UserCharityCard from "../components/charity/UserCharityCard";
import ContributionModal from "../components/charity/ContributionModal";

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isGuest = !user;

  const [charities, setCharities] = useState<Charity[]>([]);
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [charityData, drawData] = await Promise.all([getCharities(), getPublicDraws()]);
        setCharities(charityData);
        setDraws(drawData);
      } catch (error) {
        console.error("Home data fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-20 text-xl">Loading Home...</div>;

  const previewCharities = charities.slice(0, 3);
  const previewDraws = draws.slice(0, 3);

  const handleContributeClick = (charity: Charity) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedCharity(charity);
    setShowModal(true);
  };

  const handleContribute = async (charityId: string, amount: number) => {
    if (!user) {
      navigate("/login");
      return;
    }
  
    alert(`Thank you for contributing $${amount} to this cause! 🎉`);
    setShowModal(false);
    setSelectedCharity(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-emerald-900 text-white">
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">Play Golf. Win Big. Give Back.</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg md:text-xl text-emerald-200">
            Join the community where each draw and score supports real charities. Track performance, race for prizes, and make an impact.
          </p>

          {isGuest && (
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate("/register")}
                className="bg-yellow-400 text-emerald-900 font-bold px-8 py-3 rounded-lg shadow-lg hover:scale-105 transition"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-emerald-900 font-semibold px-8 py-3 rounded-lg shadow hover:shadow-md transition"
              >
                Login
              </button>
            </div>
          )}
          {!isGuest && (
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-yellow-400 text-emerald-900 font-bold px-8 py-3 rounded-lg shadow-lg hover:scale-105 transition"
              >
                View Dashboard
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-6 py-10">
        <div className="text-center">
          <p className="text-sm text-gray-500 font-medium">
            {isGuest ? "Sign up to unlock full access" : "You are logged in, enjoy all features!"}
          </p>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <article className="relative rounded-2xl border border-emerald-100 bg-white p-6 shadow-lg hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold text-emerald-800">🏛️ Featured Charities</h2>
            {previewCharities.length === 0 ? (
              <p className="text-gray-500 mt-4">No charities available yet.</p>
            ) : (
              <div className={`${isGuest ? "opacity-50 blur-sm pointer-events-none" : ""} mt-4 space-y-3`}>
                {previewCharities.map((charity) => (
                  <div key={charity.id} className="rounded-lg border p-3 hover:border-emerald-300 transition">
                    {charity.image_url && (
                      <img
                        src={charity.image_url}
                        alt={charity.name}
                        className="w-full h-20 object-cover rounded mb-2"
                      />
                    )}
                    <h3 className="font-semibold">{charity.name}</h3>
                    <p className="text-gray-600 text-sm">{charity.description}</p>
                    {!isGuest && (
                      <button
                        onClick={() => handleContributeClick(charity)}
                        className="mt-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded transition"
                      >
                        Contribute
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {isGuest && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-emerald-700 bg-white/90 p-4 rounded-lg">
                  <p className="font-semibold text-sm">Register to support charities</p>
                </div>
              </div>
            )}
            <Link to="/charities" className="mt-4 block text-center text-emerald-700 hover:text-emerald-900 font-semibold">
              View All Charities →
            </Link>
          </article>

          <article className="relative rounded-2xl border border-emerald-100 bg-white p-6 shadow-lg hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold text-emerald-800">Upcoming Draws</h2>
            <div className={`${isGuest ? "opacity-50 blur-sm" : ""} mt-4 space-y-3`}>
              {previewDraws.length === 0 ? (
                <p className="text-gray-500">No draws scheduled.</p>
              ) : (
                previewDraws.map((draw) => (
                  <div key={draw.id} className="rounded-lg border p-3 hover:border-emerald-300 transition">
                    <h3 className="font-semibold">{draw.title}</h3>
                    <p className="text-gray-600 text-sm">{new Date(draw.date).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
            {isGuest && (
              <div className="absolute inset-0 flex items-center justify-center text-center text-emerald-700 text-sm font-semibold">
                Login to participate and view full draw info
              </div>
            )}
          </article>
        </div>

        <div className="mt-10 text-center">
          <Link to={isGuest ? "/register" : "/dashboard"} className="inline-block bg-emerald-700 text-white px-8 py-3 rounded-lg hover:bg-emerald-800 transition">
            {isGuest ? "Unlock Full Access" : "Go to Dashboard"}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
