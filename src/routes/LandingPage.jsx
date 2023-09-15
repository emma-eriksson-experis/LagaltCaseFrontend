import { useEffect, useState } from "react"
import { ProjectBanner } from "../components/ProjectBanner"

export function LandingPage(){

    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch('https://localhost:7291/api/Project');
            const data = await response.json();
            setProjects(data);
            setFilteredProjects(data);
        }

        fetchProjects();
    }, []);

    const handleOnChange = (event) => {
        const query = event.target.value;
        const newFilteredProjects = projects.filter(project => project.projectName.toLowerCase().includes(query.toLowerCase()));
        setFilteredProjects(newFilteredProjects);
        console.log(newFilteredProjects);
    }

    return(
        <main className="flex flex-col items-center">
                 <div className="pb-6">
                    <form>
                        <input 
                            className="w-96 border-2 border-sky-200 rounded-full pl-2 py-1 hover:border-sky-400 focus:outline-none focus:ring focus:ring-sky-300"
                            type="text" 
                            name="search" 
                            placeholder="Search" 
                            aria-label="search"
                            onChange={handleOnChange}
                        >
                        </input>
                    </form>
                </div>
            <div className="p-6">
                {
                    filteredProjects.map(project => <ProjectBanner key={project.id} project={project} />)
                }
            </div>
        </main>
    )
}