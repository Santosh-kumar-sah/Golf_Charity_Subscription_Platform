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
    // TODO: Implement actual contribution API endpoint
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
// // // // import { type Charity, getCharities } from "../api/charityApi";
// // // // import { type Score, getUserScores } from "../api/scoreApi";
// // // // import { type Draw, getPublicDraws } from "../api/drawApi";
// // // // import { getUserSubscription, type Subscription } from "../api/subscriptionApi";

// // // // const Home: React.FC = () => {
// // // //   const { user, loading: authLoading } = useContext(AuthContext);

// // // //   const [charities, setCharities] = useState<Charity[]>([]);
// // // //   const [scores, setScores] = useState<Score[]>([]);
// // // //   const [draws, setDraws] = useState<Draw[]>([]);
// // // //   const [subscription, setSubscription] = useState<Subscription | null>(null);
// // // //   const [loading, setLoading] = useState(true);

// // // //   useEffect(() => {
// // // //     const fetchData = async () => {
// // // //       setLoading(true);
// // // //       try {
// // // //         // Fetch charities and draws for all users
// // // //         const [charityData, drawData] = await Promise.all([
// // // //           getCharities(),
// // // //           getPublicDraws(),
// // // //         ]);
// // // //         setCharities(charityData);
// // // //         setDraws(drawData);

// // // //         if (user) {
// // // //           // Fetch user's scores
// // // //           const scoreData = await getUserScores();
// // // //           setScores(scoreData);

// // // //           // Fetch subscription if exists
// // // //           const subscriptionData = await getUserSubscription();
// // // //           setSubscription(subscriptionData);
// // // //         }
// // // //       } catch (err) {
// // // //         console.error("Error fetching home data:", err);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };

// // // //     if (!authLoading) {
// // // //       fetchData();
// // // //     }
// // // //   }, [user, authLoading]);

// // // //   if (loading || authLoading) return <div className="text-center mt-10">Loading...</div>;

// // // //   return (
// // // //     <div className="container mx-auto p-6">
// // // //       {/* Hero */}
// // // //       <section className="mb-10 text-center">
// // // //         <h1 className="text-4xl font-bold">
// // // //           Welcome {user ? user.name : "to Golf Charity Platform"}
// // // //         </h1>
// // // //         <p className="mt-2 text-gray-600">
// // // //           {user
// // // //             ? subscription?.active
// // // //               ? "Enjoy all premium features!"
// // // //               : "Unlock premium features by subscribing."
// // // //             : "Register or login to participate in draws and track your scores."}
// // // //         </p>
// // // //       </section>

// // // //       {/* Charities */}
// // // //       <section className="mb-10">
// // // //         <h2 className="text-2xl font-bold mb-4">Charities</h2>
// // // //         <div className="grid md:grid-cols-3 gap-4">
// // // //           {charities.map((charity) => (
// // // //             <div
// // // //               key={charity.id}
// // // //               className="border p-4 rounded shadow hover:shadow-lg transition"
// // // //             >
// // // //               <h3 className="font-bold text-lg">{charity.name}</h3>
// // // //               <p className="text-gray-600">{charity.description}</p>
// // // //               <p className="mt-2 text-sm">
// // // //                 Raised: ${charity.amountRaised} / ${charity.targetAmount}
// // // //               </p>
// // // //             </div>
// // // //           ))}
// // // //         </div>
// // // //       </section>

// // // //       {/* Draws */}
// // // //       <section className="mb-10">
// // // //         <h2 className="text-2xl font-bold mb-4">Upcoming Draws</h2>
// // // //         <div className="grid md:grid-cols-3 gap-4">
// // // //           {draws.map((draw) => (
// // // //             <div
// // // //               key={draw.id}
// // // //               className="border p-4 rounded shadow hover:shadow-lg transition"
// // // //             >
// // // //               <h3 className="font-bold text-lg">{draw.title}</h3>
// // // //               <p className="text-gray-600">
// // // //                 Date: {new Date(draw.date).toLocaleDateString()}
// // // //               </p>
// // // //               {subscription?.active ? (
// // // //                 <p className="text-green-600 font-semibold">
// // // //                   Prize: ${draw.prizeAmount}
// // // //                 </p>
// // // //               ) : (
// // // //                 <p className="text-gray-400">Subscribe to see prize</p>
// // // //               )}
// // // //             </div>
// // // //           ))}
// // // //         </div>
// // // //       </section>

// // // //       {/* Scores */}
// // // //       {user && (
// // // //         <section className="mb-10">
// // // //           <h2 className="text-2xl font-bold mb-4">Your Scores</h2>
// // // //           {scores.length === 0 ? (
// // // //             <p className="text-gray-600">No scores yet.</p>
// // // //           ) : (
// // // //             <div className="grid md:grid-cols-2 gap-4">
// // // //               {scores.map((score) => (
// // // //                 <div
// // // //                   key={score.id}
// // // //                   className="border p-4 rounded shadow hover:shadow-lg transition"
// // // //                 >
// // // //                   <p>
// // // //                     Score: <span className="font-bold">{score.score}</span>
// // // //                   </p>
// // // //                   <p>Date: {new Date(score.date).toLocaleDateString()}</p>
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //           )}
// // // //         </section>
// // // //       )}

// // // //       {/* Subscription CTA */}
// // // //       {user && !subscription?.active && (
// // // //         <section className="text-center mt-10 p-6 bg-yellow-100 rounded">
// // // //           <p className="mb-4 font-semibold">
// // // //             Subscribe now to unlock premium draws and features!
// // // //           </p>
// // // //           <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
// // // //             Go to Subscription
// // // //           </button>
// // // //         </section>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Home;

// // // // src/pages/Home.tsx
// // // import React, { useEffect, useState, useContext } from "react";
// // // import { AuthContext } from "../context/AuthContext";
// // // import { type Charity, getCharities } from "../api/charityApi";
// // // import { type Score, getUserScores } from "../api/scoreApi";
// // // import { type Draw, getPublicDraws } from "../api/drawApi";
// // // import { useNavigate } from "react-router-dom";
// // // import { type Subscription, getUserSubscription  } from "../api/subscriptionApi";

// // // const Home: React.FC = () => {
// // //   const { user } = useContext(AuthContext);
// // //   const navigate = useNavigate();

// // //   const [charities, setCharities] = useState<Charity[]>([]);
// // //   const [scores, setScores] = useState<Score[]>([]);
// // //   const [draws, setDraws] = useState<Draw[]>([]);
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       try {
// // //         const [charityData, drawData] = await Promise.all([
// // //           getCharities(),
// // //           getPublicDraws(),
// // //         ]);
// // //         setCharities(charityData);
// // //         setDraws(drawData);

// // //         if (user) {
// // //           const scoreData = await getUserScores();
// // //           setScores(scoreData);
// // //         }
// // //       } catch (err) {
// // //         console.error("Error fetching home data", err);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };
// // //     fetchData();
// // //   }, [user]);

// // //   if (loading) return <div className="text-center mt-20 text-xl">Loading...</div>;

// // //   return (
// // //     <div className="container mx-auto px-4 py-6">
// // //       {/* Hero Section */}
// // //       <section className="mb-12 text-center">
// // //         <h1 className="text-5xl font-bold mb-4">
// // //           Welcome {user ? user.name : "to Golf Charity Platform"}
// // //         </h1>
// // //         <p className="text-gray-700 text-lg">
// // //           {user
// // //             ? user.subscription?.active
// // //               ? "Enjoy all premium features!"
// // //               : "Unlock premium features by subscribing."
// // //             : "Register or login to participate in draws and track your scores."}
// // //         </p>
// // //         {!user && (
// // //           <div className="mt-6 flex justify-center gap-4">
// // //             <button
// // //               onClick={() => navigate("/login")}
// // //               className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition"
// // //             >
// // //               Login
// // //             </button>
// // //             <button
// // //               onClick={() => navigate("/register")}
// // //               className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition"
// // //             >
// // //               Register
// // //             </button>
// // //           </div>
// // //         )}
// // //       </section>

// // //       {/* Charities */}
// // //       <section className="mb-12">
// // //         <h2 className="text-3xl font-bold mb-6">Charities</h2>
// // //         <div className="grid md:grid-cols-3 gap-6">
// // //           {charities.map((charity) => (
// // //             <div
// // //               key={charity.id}
// // //               className="border rounded-lg p-6 shadow hover:shadow-lg transition"
// // //             >
// // //               <h3 className="font-semibold text-xl mb-2">{charity.name}</h3>
// // //               <p className="text-gray-600 mb-2">{charity.description}</p>
// // //               <p className="text-gray-800 font-medium">
// // //                 Raised: ${charity.amountRaised} / ${charity.targetAmount}
// // //               </p>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </section>

// // //       {/* Draws */}
// // //       <section className="mb-12">
// // //         <h2 className="text-3xl font-bold mb-6">Upcoming Draws</h2>
// // //         <div className="grid md:grid-cols-3 gap-6">
// // //           {draws.map((draw) => (
// // //             <div
// // //               key={draw.id}
// // //               className="border rounded-lg p-6 shadow hover:shadow-lg transition"
// // //             >
// // //               <h3 className="font-semibold text-xl mb-2">{draw.title}</h3>
// // //               <p className="text-gray-600 mb-2">
// // //                 Date: {new Date(draw.date).toLocaleDateString()}
// // //               </p>
// // //               {user?.subscription?.active ? (
// // //                 <p className="text-green-600 font-bold">
// // //                   Prize: ${draw.prizeAmount}
// // //                 </p>
// // //               ) : (
// // //                 <p className="text-gray-400">Subscribe to see prize</p>
// // //               )}
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </section>

// // //       {/* User Scores */}
// // //       {user && (
// // //         <section className="mb-12">
// // //           <h2 className="text-3xl font-bold mb-6">Your Scores</h2>
// // //           {scores.length === 0 ? (
// // //             <p className="text-gray-600">No scores yet.</p>
// // //           ) : (
// // //             <div className="grid md:grid-cols-2 gap-6">
// // //               {scores.map((score) => (
// // //                 <div
// // //                   key={score.id}
// // //                   className="border rounded-lg p-4 shadow hover:shadow-lg transition"
// // //                 >
// // //                   <p>
// // //                     Score: <span className="font-bold">{score.score}</span>
// // //                   </p>
// // //                   <p>Date: {new Date(score.date).toLocaleDateString()}</p>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           )}
// // //         </section>
// // //       )}

// // //       {/* Subscription CTA */}
// // //       {user && !user.subscription?.active && (
// // //         <section className="text-center p-6 bg-yellow-100 rounded">
// // //           <p className="mb-4 font-semibold">
// // //             Subscribe now to unlock premium draws and features!
// // //           </p>
// // //           <button
// // //             onClick={() => navigate("/subscription")}
// // //             className="bg-yellow-500 text-white py-2 px-6 rounded hover:bg-yellow-600 transition"
// // //           >
// // //             Go to Subscription
// // //           </button>
// // //         </section>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default Home;

// // // src/pages/Home.tsx
// // import React, { useEffect, useState, useContext } from "react";
// // import { AuthContext } from "../context/AuthContext";
// // import { type Charity, getCharities } from "../api/charityApi";
// // import { type Score, getUserScores } from "../api/scoreApi";
// // import { type Draw, getPublicDraws } from "../api/drawApi";

// // const Home: React.FC = () => {
// //   const { user } = useContext(AuthContext);

// //   const [charities, setCharities] = useState<Charity[]>([]);
// //   const [scores, setScores] = useState<Score[]>([]);
// //   const [draws, setDraws] = useState<Draw[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   const [emotion, setEmotion] = useState(""); // For user emotion input

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setLoading(true);
// //       try {
// //         const [charityData, drawData] = await Promise.all([getCharities(), getPublicDraws()]);
// //         setCharities(charityData);
// //         setDraws(drawData);

// //         if (user) {
// //           const scoreData = await getUserScores();
// //           setScores(scoreData);
// //         }
// //       } catch (err) {
// //         console.error("Error fetching home data", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchData();
// //   }, [user]);

// //   if (loading) return <div className="text-center mt-20 text-xl">Loading...</div>;

// //   return (
// //     <div className="container mx-auto p-6">
// //       {/* Hero Section */}
// //       <section className="mb-12 text-center bg-blue-50 p-8 rounded shadow-md">
// //         <h1 className="text-4xl font-bold mb-2">
// //           {user ? `Welcome, ${user.name}!` : "Welcome to Golf Charity Platform"}
// //         </h1>
// //         <p className="text-gray-700">
// //           {user
// //             ? user.subscription?.status === "active"
// //               ? "Enjoy all premium features and upcoming draws!"
// //               : "Subscribe to unlock premium draws and features."
// //             : "Register or login to participate in draws, track your scores, and support charities."}
// //         </p>

// //         {/* Emotion Input */}
// //         {user && (
// //           <div className="mt-4 flex justify-center">
// //             <input
// //               type="text"
// //               placeholder="How are you feeling today?"
// //               value={emotion}
// //               onChange={(e) => setEmotion(e.target.value)}
// //               className="border rounded px-4 py-2 w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
// //             />
// //           </div>
// //         )}
// //       </section>

// //       {/* Charities */}
// //       <section className="mb-12">
// //         <h2 className="text-2xl font-bold mb-4">Charities</h2>
// //         <div className="grid md:grid-cols-3 gap-6">
// //           {charities.map((charity) => (
// //             <div
// //               key={charity.id}
// //               className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white"
// //             >
// //               <h3 className="font-bold text-lg">{charity.name}</h3>
// //               <p className="text-gray-600 mt-1">{charity.description}</p>
// //               <p className="mt-2 text-sm">
// //                 Raised: <span className="font-semibold">${charity.amountRaised}</span> / ${charity.targetAmount}
// //               </p>
// //               {user && (
// //                 <button className="mt-3 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600">
// //                   Donate
// //                 </button>
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* Upcoming Draws */}
// //       <section className="mb-12">
// //         <h2 className="text-2xl font-bold mb-4">Upcoming Draws</h2>
// //         <div className="grid md:grid-cols-3 gap-6">
// //           {draws.map((draw) => (
// //             <div
// //               key={draw.id}
// //               className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white"
// //             >
// //               <h3 className="font-bold text-lg">{draw.title}</h3>
// //               <p className="text-gray-600 mt-1">Date: {new Date(draw.date).toLocaleDateString()}</p>
// //               {user?.subscription?.status === "active" ? (
// //                 <p className="text-green-600 font-semibold mt-2">Prize: ${draw.prizeAmount}</p>
// //               ) : (
// //                 <p className="text-gray-400 mt-2">Subscribe to see prize</p>
// //               )}
// //               {user && (
// //                 <button className="mt-3 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
// //                   Participate
// //                 </button>
// //               )}
// //             </div>
// //           ))}
// //         </div>
// //       </section>

// //       {/* Scores */}
// //       {user && (
// //         <section className="mb-12">
// //           <h2 className="text-2xl font-bold mb-4">Your Scores</h2>
// //           {scores.length === 0 ? (
// //             <p className="text-gray-600">No scores yet. Play some games!</p>
// //           ) : (
// //             <div className="grid md:grid-cols-2 gap-6">
// //               {scores.map((score) => (
// //                 <div
// //                   key={score.id}
// //                   className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white"
// //                 >
// //                   <p>
// //                     Score: <span className="font-bold">{score.score}</span>
// //                   </p>
// //                   <p>Date: {new Date(score.date).toLocaleDateString()}</p>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </section>
// //       )}

// //       {/* Subscription CTA */}
// //       {user && user.subscription?.status !== "active" && (
// //         <section className="text-center mt-10 p-6 bg-yellow-100 rounded">
// //           <p className="mb-4 font-semibold">
// //             Subscribe now to unlock premium draws and features!
// //           </p>
// //           <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600">
// //             Go to Subscription
// //           </button>
// //         </section>
// //       )}
// //     </div>
// //   );
// // };

// // export default Home;

// // src/pages/Home.tsx
// import React, { useEffect, useState, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { type Charity, getCharities } from "../api/charityApi";
// import { type Score, getUserScores } from "../api/scoreApi";
// import { type Draw, getPublicDraws } from "../api/drawApi";

// const Home: React.FC = () => {
//   const { user } = useContext(AuthContext);

//   const [charities, setCharities] = useState<Charity[]>([]);
//   const [scores, setScores] = useState<Score[]>([]);
//   const [draws, setDraws] = useState<Draw[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [charityData, drawData] = await Promise.all([
//           getCharities(),
//           getPublicDraws(),
//         ]);
//         setCharities(charityData);
//         setDraws(drawData);

//         if (user) {
//           const scoreData = await getUserScores();
//           setScores(scoreData);
//         }
//       } catch (err) {
//         console.error("Error fetching home data", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [user]);

//   if (loading) return <div className="text-center mt-20 text-xl">Loading...</div>;

//   return (
//     <div className="container mx-auto px-6 py-10">
//       {/* Hero */}
//       <section className="mb-12 text-center">
//         <h1 className="text-5xl font-extrabold mb-4">
//           Welcome {user ? user.name : "to Golf Charity Platform"}
//         </h1>
//         <p className="text-lg text-gray-700">
//           {user
//             ? user.subscription?.status === "active"
//               ? "Enjoy all premium features!"
//               : "Unlock premium features by subscribing."
//             : "Register or login to participate in draws, track your scores, and support charities."}
//         </p>
//         {!user && (
//           <div className="mt-6 flex justify-center gap-4">
//             <a
//               href="/register"
//               className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
//             >
//               Register
//             </a>
//             <a
//               href="/login"
//               className="bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300 transition"
//             >
//               Login
//             </a>
//           </div>
//         )}
//       </section>

//       {/* Charities */}
//       <section className="mb-12">
//         <h2 className="text-3xl font-bold mb-6">Charities</h2>
//         <div className="grid md:grid-cols-3 gap-6">
//           {charities.map((charity) => (
//             <div
//               key={charity.id}
//               className="border rounded-lg shadow hover:shadow-lg p-5 transition"
//             >
//               <h3 className="text-xl font-semibold mb-2">{charity.name}</h3>
//               <p className="text-gray-600 mb-3">{charity.description}</p>
//               <p className="text-sm text-gray-500">
//                 Raised: ${charity.amountRaised} / ${charity.targetAmount}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Draws */}
//       <section className="mb-12">
//         <h2 className="text-3xl font-bold mb-6">Upcoming Draws</h2>
//         <div className="grid md:grid-cols-3 gap-6">
//           {draws.map((draw) => (
//             <div
//               key={draw.id}
//               className="border rounded-lg shadow hover:shadow-lg p-5 transition"
//             >
//               <h3 className="text-xl font-semibold mb-2">{draw.title}</h3>
//               <p className="text-gray-600 mb-1">
//                 Date: {new Date(draw.date).toLocaleDateString()}
//               </p>
//               {user?.subscription?.status === "active" ? (
//                 <p className="text-green-600 font-bold">
//                   Prize: ${draw.prizeAmount ?? "TBD"}
//                 </p>
//               ) : (
//                 <p className="text-gray-400 italic">Subscribe to see prize</p>
//               )}
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Scores */}
//       {user && (
//         <section className="mb-12">
//           <h2 className="text-3xl font-bold mb-6">Your Scores</h2>
//           {scores.length === 0 ? (
//             <p className="text-gray-600">No scores yet.</p>
//           ) : (
//             <div className="grid md:grid-cols-2 gap-6">
//               {scores.map((score) => (
//                 <div
//                   key={score.id}
//                   className="border rounded-lg shadow hover:shadow-lg p-4 transition"
//                 >
//                   <p>
//                     Score: <span className="font-bold">{score.score}</span>
//                   </p>
//                   <p>Date: {new Date(score.date).toLocaleDateString()}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       )}

//       {/* Subscription CTA */}
//       {user && user.subscription?.status !== "active" && (
//         <section className="text-center p-6 bg-yellow-100 rounded-lg">
//           <p className="mb-4 font-semibold">
//             Subscribe now to unlock premium draws and features!
//           </p>
//           <a
//             href="/subscription"
//             className="bg-yellow-500 text-white py-2 px-6 rounded hover:bg-yellow-600 transition"
//           >
//             Go to Subscription
//           </a>
//         </section>
//       )}
//     </div>
//   );
// };

// export default Home;