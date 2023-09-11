import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useState } from "react"

export function AdminPage(){
    const { keycloak } = useKeycloak();

    const [projects, setProjects] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [user, setUser] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectApplications, setProjectApplications] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`https://localhost:7291/api/Users/UniqueUser/${keycloak.subject}`);
            const data = await response.json();
            setUser(data);
        }

        fetchUser();
    }, [keycloak.subject]);

    useEffect(() => {
        const fetchProjects = async () => {
            const response = await fetch('https://localhost:7291/api/Project');
            const data = await response.json();
            const filteredProjects = data.filter((project) => project.userId === user.id);
            setProjects(filteredProjects);
        }

        if (user && industries.length > 0) {
            fetchProjects();
        }
    }, [user, industries]);

    useEffect(() => {
        const fetchIndustries = async () => {
            const response = await fetch('https://localhost:7291/api/Industry');
            const data = await response.json();
            setIndustries(data);
        }

        fetchIndustries();
    }, []);

    useEffect(() => {
        const fetchProjectApplications = async () => {
            try {
              // Fetch the list of project applications
              const applicationsResponse = await fetch('https://localhost:7291/api/ProjectApplication');
              const applicationsData = await applicationsResponse.json();
              const filteredApplicationsData = applicationsData.filter((projectApplication) => projectApplication.projectId === selectedProject.id);
      
              // Fetch users for each project application using Promise.all
              const applicationsWithUsers = await Promise.all(
                filteredApplicationsData.map(async (application) => {
                  // Fetch the user for each project application
                  const userResponse = await fetch(`https://localhost:7291/api/Users/${application.userId}`);
                  const userData = await userResponse.json();
                  
                  // Combine project application and user data
                  return { ...application, user: userData };
                })
              );

              console.log(applicationsWithUsers)
      
              // Update state with the combined data
              setProjectApplications(applicationsWithUsers);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
        }

        if(selectedProject){
            fetchProjectApplications();
        }
        
    }, [selectedProject]);

    const updateProject = async (data) => {
        const url = `https://localhost:7291/api/Project/${selectedProject.id}`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
        
            if(response.ok) {
                alert("Project updated successfully");
            } else {
                alert("Project not updated successfully");
            }
        } catch(error) {
            alert("An error occured while updating the project");
        }
    };

    const acceptApplication = (application) => {
        updateProject({
            ...selectedProject,
            addUserId: application.userId,
        });

        deleteApplication(application);
    }

    const deleteApplication = async (applicationToDelete) => {
        const url = `https://localhost:7291/api/ProjectApplication/${applicationToDelete.id}`;

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        
            if(response.ok) {
                setProjectApplications((prev) => prev.filter(application => application.id !== applicationToDelete.id));
            } else {
                alert("Project application not deleted successfully");
            }
        } catch(error) {
            alert("An error occured while deleting the project application");
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        updateProject({ ...selectedProject });
    }
    
    return(
        <div className="flex flex-col space-y-2 w-2/5 justify-center ml-4">
            {
                projects.map(project => (
                    <div key={project.id} className="flex space-x-4"> 
                        <h1 className="font-semibold text-lg">{project.projectName}</h1>
                        <button onClick={() => setSelectedProject(project)} className="bg-blue-600 text-white border-transparent rounded-md px-2 hover:bg-blue-400">Edit</button>
                    </div>
                ))
            }
            {
                selectedProject && (
                    <form className="flex flex-col space-y-2" onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <label className="font-semibold">
                                Project name
                            </label>
                            <input type="text" value={selectedProject.projectName} onChange={(event) => setSelectedProject({ ...selectedProject, projectName: event.target.value })}/>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold">
                                Description
                            </label>
                            <input type="text" value={selectedProject.description} onChange={(event) => setSelectedProject({ ...selectedProject, description: event.target.value })}/>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold">
                                Industry
                            </label>
                            <select value={selectedProject.industryId} onChange={(event) => setSelectedProject({ ...selectedProject, industryId: event.target.value })}>
                                {
                                    industries.map((industry) => <option key={industry.id} value={industry.id}>{industry.industryName}</option>)
                                }
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold">
                                Image
                            </label>
                            <input type="text" value={selectedProject.image} onChange={(event) => setSelectedProject({ ...selectedProject, image: event.target.value })}/>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold">
                                Project Skills
                            </label>
                            <input type="text" value={selectedProject.projectSkills} onChange={(event) => setSelectedProject({ ...selectedProject, projectSkills: event.target.value })}/>
                        </div>
                        <div className="flex">
                            <input className="bg-orange-700 text-white px-5 py-2 rounded-full hover:bg-red-800" type="submit" value="Save"/>
                        </div>
                    </form>
                )
            }
            {
                !!projectApplications.length && (
                    <div className="flex flex-col space-y-2 py-4">
                        <h1 className="font-bold text-2xl">Applications</h1>
                        {
                            projectApplications.map((projectApplication) => (
                                <div key={projectApplication.id} className="flex items-start justify-between p-2 bg-white border-transparent rounded shadow-md">
                                    <div className="flex flex-col">
                                        <h1 className="font-bold text-lg">{projectApplication.user.fullName}</h1>
                                        <h3 className="italic text-md">{projectApplication.motivation}</h3>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => acceptApplication(projectApplication)} className="bg-green-600 text-white border-transparent rounded-md px-2 hover:bg-green-400">Accept</button>
                                        <button onClick={() => deleteApplication(projectApplication)} className="bg-red-600 text-white border-transparent rounded-md px-2 hover:bg-red-400">Decline</button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}