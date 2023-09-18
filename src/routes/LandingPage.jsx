import { useEffect, useState } from "react"
import { ProjectBanner } from "../components/ProjectBanner"

export function LandingPage(){

    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [industries, setIndustries] = useState([]);

    useEffect(() => {
        const fetchIndustries = async () => {
            const response = await fetch('https://localhost:7291/api/Industry');
            const data = await response.json();
            setIndustries(data);
        }

        fetchIndustries();
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch('https://localhost:7291/api/Project');
            const projectsData = await response.json();

            // Fetch the industry for each project using Promise.all
            const projectsWithIndustries = await Promise.all(
                projectsData.map(async (project) => {
                  // Fetch the industry for each project
                  const industryResponse = await fetch(`https://localhost:7291/api/Industry/${project.industryId}`);
                  const industryData = await industryResponse.json();
                  
                  // Combine project and industry data
                  return { ...project, industry: industryData };
                })
              );
            setProjects(projectsWithIndustries);
            setFilteredProjects(projectsWithIndustries);
        }

        fetchProjects();
    }, []);

    const handleOnChange = (event) => {
        const query = event.target.value;
        const newFilteredProjects = projects.filter(project => project.projectName.toLowerCase().includes(query.toLowerCase()));
        setFilteredProjects(newFilteredProjects);
    }

    const handleIndustryChange = (event) => {
        const industryId = event.target.value;
        if (industryId === '0') {
            setFilteredProjects(projects);
        } else {
            const newFilteredProjects = projects.filter(project => project.industryId === parseInt(industryId));
            setFilteredProjects(newFilteredProjects);
        }
    }

    return(
        <main className="flex flex-col items-center">
            <div className="pb-6">
                <form className="flex space-x-8">
                    <input 
                        className="w-96 border-2 border-sky-200 rounded-full pl-2 py-1 hover:border-sky-400 focus:outline-none focus:ring focus:ring-sky-300"
                        type="text" 
                        name="search" 
                        placeholder="Search" 
                        aria-label="search"
                        onChange={handleOnChange}
                    >
                    </input>
                    <select onChange={handleIndustryChange} className="border-2 border-sky-200 rounded-full pl-2 py-1 hover:border-sky-400 focus:outline-none focus:ring focus:ring-sky-300">
                        <option value={0}>All industries</option>
                        {
                            industries.map((industry) => <option key={industry.id} value={industry.id}>{industry.industryName}</option>)
                        }
                    </select>
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