// src/App.tsx
import React from "react";
import { NotificationProvider } from "./context/NotificationContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <main className="flex-grow">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </NotificationProvider>
  );
};

export default App;



// src/App.tsx
// import React from "react";
// import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import Navbar  from "./components/navbar";
// import Footer from "./components/Footer";
// import AppRoutes from "./routes/AppRoutes";

// const App: React.FC = () => {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <div className="flex flex-col min-h-screen">
//           <Navbar />
//           <main className="flex-grow">
//             <AppRoutes />
//           </main>
//           <Footer />
//         </div>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// };

// export default App;