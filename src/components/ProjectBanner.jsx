import { useNavigate } from "react-router-dom";

export function ProjectBanner({ project }) {
    const navigate = useNavigate();

    return (
        <article className="bg-white mt-4 border border-slate hover:border-slate-700 rounded p-4 cursor-pointer" onClick={() => navigate(`/project/${project.id}`)}>
            <section className="flex flex-col space-y-4">
                <div className="flex space-x-2">
                    <img src={project.image} width={300} alt="image" />
                    <div className="flex flex-col">
                        <h1 className="text-xl">{project.projectName}</h1>
                        <span className="bg-sky-500 text-sm rounded-full">{project.industry}</span>
                        <p>{project.description}</p>    
                        <div className="flex space-x-2 pt-4 font-bold justify-between"> 
                            {project.projectSkills}
                        </div>    
                    </div>
                </div>
            </section>
        </article>
    )
}