import { MyProjectBanner } from "../components/MyProjectBanner";
import { useEffect, useState } from "react";

export function ProjectPage(){

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch('https://localhost:7291/api/Project');
            //Replace endpoint with get all projects by user from user project.
            const data = await response.json();
            setProjects(data);
        }

        fetchProjects();
    }, []);

    return(
        <main className="flex flex-col items-center">
            <div className="w-2/5">
                {
                    projects.map(project => <MyProjectBanner key={project.id} project={project} />)
                }
            </div>
        </main>
    )
}