import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function ProfilePage(){

    const { userId } = useParams();
    const { keycloak } = useKeycloak();

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

    // <<< Functions <<<
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
                                    <input type="text" disabled={!isSelf} value={email} onChange={(event) => setEmail(event.target.value)}/>
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-semibold">
                                        Country
                                    </label>
                                    <input type="text" disabled={!isSelf} value={country} onChange={(event) => setCountry(event.target.value)}/>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold">
                                    Bio
                                </label>
                                <textarea value={bio} disabled={!isSelf} onChange={(event) => setBio(event.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold">
                                    Picture
                                </label>
                                <input type="text" disabled={!isSelf} value={picture} onChange={(event) => setPicture(event.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold">
                                    User Skills
                                </label>
                                <input type="text" disabled={!isSelf} value={userSkills} onChange={(event) => setUserSkills(event.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold">
                                    User Accomplishments
                                </label>
                                <input type="text" disabled={!isSelf} value={userAccomplishments} onChange={(event) => setUserAccomplishments(event.target.value)}/>
                            </div>
                            <div className="flex space-x-1">
                                <label className="font-semibold">
                                    Hidden
                                </label>
                                <input type="checkbox" disabled={!isSelf} checked={hidden} onChange={() => setHidden(!hidden)}/>
                            </div>
                            <div className="flex justify-center">
                                <input className="bg-orange-700 text-white px-5 py-2 rounded-full hover:bg-red-800" type="submit" value="Save"/>
                            </div>
                        </>
                    )
                }
                
            </form>
        </div>
    )
}