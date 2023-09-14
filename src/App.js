import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./routes/LandingPage";
import { AdminPage } from "./routes/AdminPage";
import { ProfilePage } from "./routes/ProfilePage";
import { ProjectPage } from "./routes/ProjectPage";
import { MyProjectPage } from "./routes/MyProjectPage";
import { Header } from "./components/Header";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {

  return (
      <BrowserRouter>
        <Header />
        <div className="h-screen bg-slate-200 pt-4">
          <Routes>
            <Route path="/" element={ <LandingPage />} />
            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            } />
            <Route path="/profile/:userId" element={ <ProfilePage />} />
            <Route path="/project/:projectId" element={ <ProjectPage />} />
            <Route path="/myproject/:projectId" element={ <MyProjectPage />} />
          </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
