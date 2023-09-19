import { useContext, useEffect, useState } from "react"
import { ProjectBanner } from "../components/ProjectBanner"
import { AppContext } from "../App";
import { useKeycloak } from "@react-keycloak/web";

export function LandingPage(){

    const { keycloak } = useKeycloak();
    const { user } = useContext(AppContext);
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [open, setOpen] = useState(false);
    // State variables for new project modal
    const [newProjectName, setNewProjectName] = useState("");
    const [newProjectDescription, setNewProjectDescription] = useState("");
    const [newProjectImage, setNewProjectImage] = useState("");
    const [newProjectIndustry, setNewProjectIndustry] = useState("");
    const [newProjectSkills, setNewProjectSkills] = useState("");

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

    const createNewProject = async () => {
        const url = "https://localhost:7291/api/Project";
        const data = {
            "projectName": newProjectName,
            "description": newProjectDescription,
            "image": newProjectImage,
            "industryId": parseInt(newProjectIndustry),
            "userId": user.id,
            "projectSkills": newProjectSkills,
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
                // Get the new project from the response
                const newProjectData = await response.json();
                console.log(newProjectData)

                const industryResponse = await fetch(`https://localhost:7291/api/Industry/${newProjectData.industryId}`);
                const industryData = await industryResponse.json();
                // Combine project and industry data
                const newProject = { ...newProjectData, industry: industryData };
                setProjects(prev => [newProject, ...prev]);
                setFilteredProjects(prev => [newProject, ...prev]);
                setOpen(false);
                
                return newProject;
            } else {
                alert("Project failed to send");
            }
        } catch(error) {
            alert("An error occured while creating the project");
        };
    }

    const createNewAdmin = async (newAdmin) => {
        console.log(newAdmin)
        const url = "https://localhost:7291/api/Admin";

        try {
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAdmin),
            });
        } catch(error) {
            alert("An error occured while creating the admin");
        };
    }

    const handleNewProjectSubmit = async (event) => {
        event.preventDefault();

        const newProject = await createNewProject();
        console.log(newProject)
        const newAdmin = {
            "userId": user.id,
            "projectId": newProject.id,
        };
        createNewAdmin(newAdmin);
    }

    return(
        <main className="flex flex-col items-center">
            <div className="flex flex-col w-full items-center pb-6">
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
                {
                    keycloak.authenticated && (
                        <div className="flex w-full justify-end pr-6">
                            <button onClick={() => setOpen(true)} className="bg-gradient-to-r from-teal-300 to-blue-500 text-white px-5 py-2 rounded-full p-2 hover:from-blue-500 hover:to-teal-200 font-normal">Create project</button>
                        </div>
                    )
                }
            </div>
            <div className="px-6 pb-6">
                {
                    filteredProjects
                        .sort((a, b) => (a.id < b.id) ? 1 : -1)
                        .map(project => <ProjectBanner key={project.id} project={project} />)
                }
            </div>
            {
                open ? (
                    <>
                        <div className="justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative w-2/5 h-4/5 overflow-auto">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                        <h3 className="text-3xl font-semibold">
                                            Create project
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
                        
                                    <form className="relative p-6 flex flex-col space-y-2" onSubmit={handleNewProjectSubmit}>
                                        <div className="flex flex-col">
                                            <label className="font-semibold">
                                                Name
                                            </label>
                                            <input className="border-2 border-sky-200 pl-2 py-1 hover:border-sky-400 focus:outline-none focus:ring focus:ring-sky-300" value={newProjectName} onChange={(event) => setNewProjectName(event.target.value)}/>
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="font-semibold">
                                                Description
                                            </label>
                                            <textarea rows="4" className="border-2 border-sky-200 pl-2 py-1 hover:border-sky-400 focus:outline-none focus:ring focus:ring-sky-300" value={newProjectDescription} onChange={(event) => setNewProjectDescription(event.target.value)}/>
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="font-semibold">
                                                Image URL
                                            </label>
                                            <input className="border-2 border-sky-200 pl-2 py-1 hover:border-sky-400 focus:outline-none focus:ring focus:ring-sky-300" value={newProjectImage} onChange={(event) => setNewProjectImage(event.target.value)}/>
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="font-semibold">
                                                Industry
                                            </label>
                                            <select onChange={(event) => setNewProjectIndustry(event.target.value)} className="border-2 border-sky-200 rounded-full pl-2 py-1 hover:border-sky-400 focus:outline-none focus:ring focus:ring-sky-300">
                                                {
                                                    industries.map((industry) => <option key={industry.id} value={industry.id}>{industry.industryName}</option>)
                                                }
                                            </select>
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="font-semibold">
                                                Skills
                                            </label>
                                            <input className="border-2 border-sky-200 pl-2 py-1 hover:border-sky-400 focus:outline-none focus:ring focus:ring-sky-300" value={newProjectSkills} onChange={(event) => setNewProjectSkills(event.target.value)}/>
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
                                                className="bg-gradient-to-r from-teal-300 to-blue-500 text-white text-white font-normal active:bg-emerald-600 hover:bg-emerald-300 hover:from-blue-500 hover:to-teal-200 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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
                ) : null
            }
        </main>
    )
}