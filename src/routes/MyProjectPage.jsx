import { AppContext } from "../App";
import { MyProjectBanner } from "../components/MyProjectBanner";
import { useContext, useEffect, useState } from "react";

export function MyProjectPage(){

    const [projects, setProjects] = useState([]);
    const { user } = useContext(AppContext);

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch(`https://localhost:7291/api/Project/${user.id}/users`);
            //Replace endpoint with get all projects by user from user project.
            const data = await response.json();
            setProjects(data);
        }

        if (user) {
            fetchProjects();
        }
    }, [user]);

    return(
        <main className="flex flex-col items-center">
            <div className="w-auto">
                {
                    projects.map(project => <MyProjectBanner key={project.id} project={project} />)
                }
            </div>
        </main>
    )
}