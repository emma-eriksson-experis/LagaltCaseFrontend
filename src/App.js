import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./routes/LandingPage";
import { AdminPage } from "./routes/AdminPage";
import { ProfilePage } from "./routes/ProfilePage";
import { ProjectPage } from "./routes/ProjectPage";
import { Header } from "./components/Header";
import { LoginModal } from "./components/LoginModal";
import { createContext, useState } from "react";

export const AppContext = createContext();

function App() {

  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <AppContext.Provider value={{ loginModalOpen, setLoginModalOpen }}>
      <BrowserRouter>
        <div className="h-screen bg-slate-200">
          <Header />
          <Routes>
            <Route path="/" element={ <LandingPage />} />
            <Route path="/admin" element={ <AdminPage />} />
            <Route path="/profile/:userId" element={ <ProfilePage />} />
            <Route path="/project/:projectId" element={ <ProjectPage />} />
          </Routes>
          <LoginModal open={loginModalOpen} />
        </div>
    </BrowserRouter>
   </AppContext.Provider>
  );
}

export default App;
