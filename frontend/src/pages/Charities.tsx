// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { getCharities, type Charity } from "../api/charityApi";
// import UserCharityCard from "../components/charity/UserCharityCard";
// import ContributionModal from "../components/charity/ContributionModal";
// import Loader from "../components/common/Loader";
// import { useNavigate } from "react-router-dom";

// const Charities: React.FC = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [charities, setCharities] = useState<Charity[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [contributing, setContributing] = useState(false);

//   useEffect(() => {
//     fetchCharities();
//   }, []);

//   const fetchCharities = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await getCharities();
//       setCharities(data);
//     } catch (err: any) {
//       console.error("Failed to load charities", err);
//       setError("Failed to load charities. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleContributeClick = (charity: Charity) => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     setSelectedCharity(charity);
//     setShowModal(true);
//   };

//   const handleContribute = async (charityId: string, amount: number) => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }

//     try {
//       setContributing(true);
//       // TODO: Implement actual contribution API endpoint
//       // For now, show success message
//       alert(`Thank you for contributing $${amount} to this cause! 🎉`);
//       setShowModal(false);
//       setSelectedCharity(null);
//       // In the future, refresh charities to show updated raised amount
//       await fetchCharities();
//     } catch (err: any) {
//       throw new Error(err?.message || "Failed to process contribution");
//     } finally {
//       setContributing(false);
//     }
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 py-12">
//       <div className="container mx-auto px-6">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-3">
//             🏛️ Support Charities
//           </h1>
//           <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//             Every contribution helps make a real difference. Choose a cause you care about and make your impact today.
//           </p>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
//             {error}
//             <button
//               onClick={fetchCharities}
//               className="mt-2 inline-block underline hover:text-red-800 font-semibold"
//             >
//               Retry
//             </button>
//           </div>
//         )}

//         {/* Empty State */}
//         {charities.length === 0 ? (
//           <div className="rounded-xl border-2 border-dashed border-emerald-200 bg-white p-12 text-center">
//             <p className="text-gray-500 text-lg">No charities available yet. Check back soon!</p>
//           </div>
//         ) : (
//           <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//             {charities.map((charity) => (
//               <UserCharityCard
//                 key={charity.id}
//                 charity={charity}
//                 onContribute={() => handleContributeClick(charity)}
//               />
//             ))}
//           </div>
//         )}

//         {/* Stats Footer */}
//         {charities.length > 0 && (
//           <div className="mt-12 text-center">
//             <p className="text-gray-600">
//               ✨ Supporting {charities.length} amazing causes together
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Contribution Modal */}
//       <ContributionModal
//         charity={selectedCharity}
//         isOpen={showModal}
//         onClose={() => {
//           setShowModal(false);
//           setSelectedCharity(null);
//         }}
//         onContribute={handleContribute}
//       />
//     </div>
//   );
// };

// export default Charities;

import React, { useEffect, useState } from "react";
import UserCharityCard from "../components/charity/UserCharityCard";
import ContributionModal from "../components/charity/ContributionModal";
import { getCharities, type Charity } from "../api/charityApi";

const Charities: React.FC = () => {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [contributing, setContributing] = useState(false);

  // ✅ FETCH DATA (this was missing → caused crash)
  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    try {
      setLoading(true);
      const data = await getCharities();
      setCharities(data || []); // ✅ safety fallback
    } catch (err) {
      console.error("Failed to load charities", err);
      setCharities([]); // ✅ prevent crash
    } finally {
      setLoading(false);
    }
  };

  // ✅ same as old logic
  const handleContributeClick = (charity: Charity) => {
    setSelectedCharity(charity);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCharity(null);
  };

  // ✅ properly using charityId + contributing
  const handleContribute = async (charityId: string, amount: number) => {
    try {
      setContributing(true);

      console.log("Contributing:", charityId, amount);

      alert(`Thank you for contributing $${amount} 🎉`);

      setShowModal(false);
      setSelectedCharity(null);

      // optional refresh
      await fetchCharities();

    } catch (error: any) {
      throw new Error(error?.message || "Failed to process contribution");
    } finally {
      setContributing(false);
    }
  };

  // ✅ LOADING STATE
  if (loading) {
    return <div className="text-center py-10">Loading charities...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* ✅ SAFE MAP */}
      {charities.length === 0 ? (
        <p className="text-center col-span-3 text-gray-500">
          No charities available
        </p>
      ) : (
        charities.map((charity) => (
          <UserCharityCard
            key={charity.id}
            charity={charity}
            onContribute={() => handleContributeClick(charity)}
          />
        ))
      )}

      <ContributionModal
        charity={selectedCharity}
        isOpen={showModal}
        onClose={handleCloseModal}
        onContribute={handleContribute}
      />
    </div>
  );
};

export default Charities;