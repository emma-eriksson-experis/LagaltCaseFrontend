import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from "react-router-dom";

export function Header() {

    const { keycloak } = useKeycloak();
    const navigate = useNavigate();

    return(
        <header className="flex bg-white sticky top-0 z-10 w-full pr-8 h-32">
            <div className="flex w-full items-center justify-between">
                <div onClick={() => navigate("/")} className="cursor-pointer">
                    <img className="w-64 p-8" src="/Cre8ive.jpg" alt="Logo"></img>
                </div>
                <div className="flex space-x-4">
                    {
                        keycloak.authenticated ? 
                        (
                            <div className="flex space-x-4 items-center">
                                <p>Hello</p>
                                <p onClick={() => navigate(`/profile/${keycloak.subject}`) }className="cursor-pointer">{keycloak.tokenParsed.preferred_username}!</p>
                                
                                <button onClick={() => keycloak.logout()} className="w-32 bg-gradient-to-r from-teal-300 to-blue-500 text-white px-5 py-2 rounded-full p-2 hover:from-blue-500 hover:to-teal-200 font-normal">Sign out</button>
                            </div>
                        ) : 
                        (
                            <button onClick={() => keycloak.login()} className="w-32 bg-gradient-to-r from-teal-300 to-blue-500 text-white px-5 py-2 rounded-full p-2 hover:from-blue-500 hover:to-teal-200 font-normal">Sign in</button>
                        )
                    }
                    {
                        (keycloak.authenticated && keycloak.hasRealmRole('Admin')) && (
                            <button onClick={() => navigate("/admin")} className="w-32 bg-gradient-to-r from-teal-300 to-blue-500 text-white px-5 py-2 rounded-full p-2 hover:from-blue-500 hover:to-teal-200 font-normal">Admin</button>
                        )
                    }
                </div>
            </div>
        </header>
    );
}