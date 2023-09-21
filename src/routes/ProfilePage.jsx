import { useKeycloak } from "@react-keycloak/web";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../App";

export function ProfilePage(){

    const { userId } = useParams();
    const { keycloak } = useKeycloak();

    const { setUser } = useContext(AppContext);

    const [id, setId] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [country, setCountry] = useState("");
    const [picture, setPicture] = useState("");
    const [userSkills, setUserSkills] = useState("");
    const [userAccomplishments, setUserAccomplishments] = useState("");
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`https://localhost:7291/api/Users/UniqueUser/${userId}`);
            const data = await response.json();
            setId(data.id);
            setFullName(data.fullName);
            setEmail(data.email);
            setBio(data.bio);
            setCountry(data.country);
            setPicture(data.picture);
            setUserSkills(data.userSkills);
            setUserAccomplishments(data.userAccomplishments);
            setHidden(data.isHidden);
        }

        if (userId) {
            fetchUser();
        }
    }, [userId]);

    const isSelf = useMemo(() => {
        if (!keycloak.authenticated) {
            return false;
        }

        const loggedInUser = keycloak.subject;
        
        return loggedInUser === userId;
    }, [userId, keycloak.authenticated, keycloak.subject]);

/**
     * updateUser Function:
     * - Handles the updating of user data via a PUT request to the server.
     * - Constructs a data object with user details, including ID, UUID, full name, email, bio, country, picture,
     *   user skills, user accomplishments, and a flag indicating if the user is hidden.
     * - Sends a PUT request to update the user's data based on the provided URL.
     * - Displays success or error alerts based on the response.
 */
    const updateUser = async () => {
        const url = `https://localhost:7291/api/Users/${id}`;
        const data = {
            id: id,
            uuId: userId,
            fullName: fullName,
            email: email,
            bio: bio,
            country: country,
            picture: picture, 
            userSKills: userSkills, 
            userAccomplishments: userAccomplishments, 
            isHidden: hidden 
        }
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
        
            if(response.ok) {
                alert("User updated successfully");
            } else {
                alert("User not updated successfully");
            }
        } catch(error) {
            alert("An error occured while updating the user");
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        updateUser();
    }

    return(
        <div className="flex flex-col items-center">
            <form className="flex flex-col space-y-2" onSubmit={handleSubmit}>
                <div className="flex item-center space-x-4">
                    <img src={picture} width="100" height="100" alt="One picture" />
                    <div className="flex flex-col">
                        <label className="font-semibold">
                            Full name 
                        </label>
                        <input type="text" disabled={!isSelf} value={fullName} onChange={(event) => setFullName(event.target.value)}/>
                    </div>
                </div>
                {
                    (!hidden || isSelf) && (
                        <>
                            <div className="flex space-x-4">
                                <div className="flex flex-col">
                                    <label className="font-semibold">
                                        Email
                                    </label>
                                    <input className="w-80 border-2 border-sky-200 pl-2 py-1 hover:border-sky-400 focus:outline-none focus:ring focus:ring-sky-300" type="text" disabled={!isSelf} value={email} onChange={(event) => setEmail(event.target.value)}/>
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-semibold">
                                        Country
                                    </label>
                                    <input className="w-30 border-2 border-sky-200 pl-2 py-1 hover:border-sky-400 focus:outline-none focus:ring focus:ring-sky-300" type="text" disabled={!isSelf} value={country} onChange={(event) => setCountry(event.target.value)}/>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold">
                                    Bio
                                </label>
                                <textarea className="w-full border-2 border-sky-200 pl-2 py-1 hover:border-sky-400 focus:outline-none focus:ring focus:ring-sky-300" rows="4" value={bio} disabled={!isSelf} onChange={(event) => setBio(event.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold">
                                    Picture
                                </label>
                                <input className="w-full border-2 border-sky-200 pl-2 py-1 hover:border-sky-400 focus:outline-none focus:ring focus:ring-sky-300" type="text" disabled={!isSelf} value={picture} onChange={(event) => setPicture(event.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold">
                                    User Skills
                                </label>
                                <textarea className="w-full border-2 border-sky-200 pl-2 py-1 hover:border-sky-400 focus:outline-none focus:ring focus:ring-sky-300" rows="4" disabled={!isSelf} value={userSkills} onChange={(event) => setUserSkills(event.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold">
                                    User Accomplishments
                                </label>
                                <textarea className="w-full border-2 border-sky-200 pl-2 py-1 hover:border-sky-400 focus:outline-none focus:ring focus:ring-sky-300" rows="4" disabled={!isSelf} value={userAccomplishments} onChange={(event) => setUserAccomplishments(event.target.value)}/>
                            </div>
                            <div className="flex space-x-1">
                                <label className="font-semibold">
                                    Hidden
                                </label>
                                <input className="w-10 border-2 border-sky-200 pl-2 py-1 hover:border-sky-400 focus:outline-none focus:ring focus:ring-sky-300" type="checkbox" disabled={!isSelf} checked={hidden} onChange={() => setHidden(!hidden)}/>
                            </div>
                            <div className="flex justify-center">
                                <input className="w-32 bg-gradient-to-r from-teal-300 to-blue-500 text-white px-5 py-2 rounded-full p-2 hover:from-blue-500 hover:to-teal-200 font-normal mb-10 cursor-pointer" type="submit" value="Save"/>
                            </div>
                        </>
                    )
                }
                
            </form>
        </div>
    )
}