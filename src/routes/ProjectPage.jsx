import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function ProjectPage(){

    const { projectId } = useParams();

    const { keycloak, initialized } = useKeycloak();

    const [project, setProject] = useState(null);

    const [open, setOpen] = useState(false);

    const [user, setUser] = useState(null);

    const [motivation, setMotivation] = useState("");

    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            const response = await fetch(`https://localhost:7291/api/Project/${projectId}`);
            const data = await response.json();
            setProject(data);
        };
        fetchProject();
    },[projectId]);

    useEffect(() => {
        const fetchAdmin = async () => {
            const response = await fetch(`https://localhost:7291/api/Admin/${project.userId}/projects`);
            const data = await response.json();
            console.log(data);
            if(data.length > 0)
            {
                setAdmin(data[0]);
            }
        };
        if(project) {
            fetchAdmin();
        }  
    },[project]);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`https://localhost:7291/api/Users/UniqueUser/${keycloak.subject}`);
            console.log(response);
            const data = await response.json();
            setUser(data);
        };
        console.log(keycloak)
        if(initialized && keycloak.authenticated)
        {
            fetchUser();
        }
    },[keycloak.subject]);



    const createProjectApplication = async () => {
        console.log(user);
        const url = "https://localhost:7291/api/ProjectApplication";
        const data = {
            "userId": user.id,
            "projectId": project.id,
            "adminId": admin.id,
            "status": true,
            "motivation": motivation
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
                alert("Motivation sent successfully");
            } else {
                alert("motivation failed to send");
            }
        } catch(error) {
            alert("An error occured while creating the motivation");
        };
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        createProjectApplication();
        setOpen(false);
    }

    return(
        <main>
            {
                project ? (
                    <div>
                        <h2>Project Details</h2>
                        <p>Project Name {project.projectName}</p>
                        <p>Description {project.description}</p>
                        {/* Render other project details as needed */}
                        <button onClick={() => setOpen(true)}>Join Project</button>
                    </div>
                ) : (
                    <p>Loading project details...</p>
                )
            }
            {open ? (
                <>
                <div
                    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                >
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
              
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                     
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <h3 className="text-3xl font-semibold">
                            Join project
                        </h3>
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            onClick={() => setOpen(false)}
                        >
                            <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                            ×
                            </span>
                        </button>
                        </div>
                       
                        <form className="relative p-6 flex-auto" onSubmit={handleSubmit}>
                            <div className="flex flex-col">
                                <label className="font-semibold">
                                    Your Motivation 
                                </label>
                                <textarea placeholder="Write your motivation here" className="my-4 text-slate-500 text-lg leading-relaxed" value={motivation} onChange={(event) => setMotivation(event.target.value)}/>
                            </div>
                           
                            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                <button
                                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button"
                                    onClick={() => setOpen(false)}
                                >
                                    Close
                                </button>
                                <button
                                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="submit"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                    </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </main>
    )
}