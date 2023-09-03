import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./routes/LandingPage";
import { AdminPage } from "./routes/AdminPage";
import { ProfilePage } from "./routes/ProfilePage";
import { ProjectPage } from "./routes/ProjectPage";

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen bg-slate-200">
        <Routes>
          <Route path="/" element={ <LandingPage />} />
          <Route path="/admin" element={ <AdminPage />} />
          <Route path="/profile/:userId" element={ <ProfilePage />} />
          <Route path="/project/:projectId" element={ <ProjectPage />} />
        </Routes>
      </div>
   </BrowserRouter>
  );
}

export default App;
