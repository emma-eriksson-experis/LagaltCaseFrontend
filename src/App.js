import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./routes/LandingPage";
import { AdminPage } from "./routes/AdminPage";
import { ProfilePage } from "./routes/ProfilePage";
import { ProjectPage } from "./routes/ProjectPage";
import { MyProjectPage } from "./routes/MyProjectPage";
import { Header } from "./components/Header";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from './keycloak';
import { createContext, useState } from "react";

const config = {
  checkLoginIframe: false,
  onLoad: 'check-sso',
  silentCheckSsoRedirectUri:
  window.location.origin + '/silent-check-sso.html',
};

export const AppContext = createContext(null);

function App() {

  const [user, setUser] = useState(null);

  const checkUser = async () => {
    if (keycloak.authenticated) {
        const response = await fetch(`https://localhost:7291/api/Users/UniqueUser/${keycloak.subject}`);
        if (response.status === 400) {
          // User is newly registered. Add it to the database
          createUser();
        } else {
          // User already exists in the database
          const data = await response.json();
          setUser(data);
        }
    }
  }

  const createUser = async () => {
    const url = "https://localhost:7291/api/Users";
    const data = {
      "uuId": keycloak.subject,
      "fullName": keycloak.tokenParsed.name,
      "email": keycloak.tokenParsed.email,
      "country": "",
      "bio": "",
      "picture": "",
      "userSkills": ""
    }

    try {
      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });
    
      if(response.ok) {
          const data = await response.json();
          setUser(data);
      } else {
          alert("Failed to create new user");
      }
    } catch(error) {
        alert("An error occured while creating the new user");
    };
  }

  const handleKeycloakEvent = async (eventType) => {
    if (eventType === 'onAuthSuccess') {
      checkUser();
    }
  }

  return (
    <ReactKeycloakProvider authClient={keycloak} initOptions={config} onEvent={handleKeycloakEvent} >
      <AppContext.Provider value={{ user }}>
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
      </AppContext.Provider>
    </ReactKeycloakProvider>
  );
}

export default App;
