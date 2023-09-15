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
        <div className="h-screen bg-white pt-4">
          <Routes>
            <Route path="/" element={ <LandingPage />} />
            <Route path="/admin" element={
              <ProtectedRoute roles={['Admin']}>
                <AdminPage />
              </ProtectedRoute>
            } />
            <Route path="/project/:projectId" element={ <ProjectPage />} />
            <Route path="/profile/:userId" element={
              <ProtectedRoute roles={['default-roles-team-lagalt']}> 
                <ProfilePage />
                </ProtectedRoute>
            } />
            <Route path="/myproject/:userId" element={
              <ProtectedRoute roles={['default-roles-team-lagalt']}> 
                <MyProjectPage/>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
