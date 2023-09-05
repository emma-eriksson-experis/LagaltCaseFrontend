import { useNavigate } from "react-router-dom";

export function ProjectBanner({ project }) {
    const navigate = useNavigate();

    return (
        <article className="bg-white mt-4 border-transparent rounded shadow-lg p-2 cursor-pointer" onClick={() => navigate(`/project/${project.id}`)}>
            <section className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="font-bold text-lg">{project.projectName}</h1>
                    <span className=" bg-sky-500 text-sm border-transparent rounded-full px-2">
                        {project.industry}
                    </span>
                </div>
                <div className="flex space-x-2">
                    <img src={project.image} width={100} height={100} alt="image" />
                    <div className="flex flex-col justify-between items-center">
                        <p>{project.description}</p>
                        <div className="flex space-x-2">
                            {project.projectSkills}
                        </div>
                    </div>
                </div>
            </section>
        </article>
    )
}