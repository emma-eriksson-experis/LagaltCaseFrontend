import { useKeycloak } from "@react-keycloak/web";

export function Header() {

    const { keycloak } = useKeycloak();

    return(
        <header class="flex bg-white sticky top-0 z-10 w-full border-b-[2px] border-gray-500 p-8">
            <div class="flex w-full items-center justify-between">
                <div>
                    <img class="w-28" src="./Logo.png" alt="Logo"></img>
                </div>
                <div>
                    <form>
                        <input 
                            className="w-[300px] border-2 border-slate-300 rounded-full pl-2 py-1"
                            type="text" 
                            name="search" 
                            placeholder="Search" 
                            aria-label="search"
                        >
                        </input>
                    </form>
                </div>
                <div>
                    {
                        keycloak.authenticated ? 
                        (
                            <div className="flex space-x-4 items-center">
                                <p>Inloggad som: </p>
                                <p className="font-bold">{keycloak.tokenParsed.preferred_username}</p>
                                <button onClick={() => keycloak.logout()} class="bg-orange-700 text-white px-5 py-2 rounded-full hover:bg-red-800">Sign out</button>
                            </div>
                        ) : 
                        (
                            <button onClick={() => keycloak.login()} class="bg-orange-700 text-white px-5 py-2 rounded-full hover:bg-red-800">Sign in</button>
                        )
                    }
                </div>
            </div>
        </header>
    );
}