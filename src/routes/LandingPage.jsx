import { useEffect, useState } from "react"
import { ProjectBanner } from "../components/ProjectBanner"

export function LandingPage(){

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch('https://localhost:7291/api/Project');
            const data = await response.json();
            setProjects(data);
        }

        fetchProjects();
    }, []);

    return(
        <main className="flex flex-col items-center">
            <div className="w-2/5">
                {
                    projects.map(project => <ProjectBanner key={project.id} project={project} />)
                }
            </div>
        </main>
    )
}