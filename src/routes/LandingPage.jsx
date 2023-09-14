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
                 <div>
                    <form>
                        <input 
                            className="w-[300px] border-2 border-slate-300 rounded-full pl-2 py-1"
                            type="text" 
                            name="search" 
                            placeholder="Search" 
                            aria-label="search"
                            onChange={handleOnChange}
                        >
                        </input>
                    </form>
                </div>
            <div className="w-2/5">
                {
                    filteredProjects.map(project => <ProjectBanner key={project.id} project={project} />)
                }
            </div>
        </main>
    )
}