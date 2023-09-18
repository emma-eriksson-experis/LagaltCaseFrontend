import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";

export function ProjectBanner({ project }) {
    const { user } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <article className="bg-white mt-4 border border-slate hover:border-slate-700 rounded p-4 cursor-pointer" onClick={() => navigate(`/project/${project.id}`)}>
            <section className="flex flex-col space-y-4">
                <div className="flex space-x-2">
                    <img src={project.image} width={300} alt="image" />
                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            <h1 className="text-xl">{project.projectName}</h1>
                            <div>
                                <span className="italic">{project.industry.industryName}</span>
                            </div>
                        </div>
                        <p>{project.description}</p>    
                        <div className="flex space-x-2 pt-4 font-bold h-full items-end"> 
                            {
                                project.projectSkills.split(',').map(skill => {
                                    if (user && user.userSkills.includes(skill)) {
                                        return <span className="bg-green-400 text-sm rounded-full px-2">{skill}</span>
                                    } else {
                                        return <span className="bg-red-400 text-sm rounded-full px-2">{skill}</span>
                                    }
                                })
                            }
                        </div>    
                    </div>
                </div>
            </section>
        </article>
    )
}