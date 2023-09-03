import { useNavigate } from "react-router-dom";

const dummyIndustries = [
    {
        id: 5,
        name: "Adventure"
    },
    {
        id: 6,
        name: "Hotel"
    },
]

export function ProjectBanner({ project }) {
    const navigate = useNavigate();

    return (
        <article className="bg-white mt-4 border-transparent rounded shadow-lg p-2 cursor-pointer" onClick={() => navigate(`/project/${project.id}`)}>
            <section className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="font-bold text-lg">{project.projectName}</h1>
                    <span className=" bg-sky-500 text-sm border-transparent rounded-full px-2">
                        {
                            dummyIndustries.find(industry => industry.id === project.industryId).name
                        }
                    </span>
                </div>
                <div className="flex space-x-2">
                    <img src={project.image} width={100} height={200} alt="Emmas profilbild" />
                    <div className="flex flex-col justify-between items-center">
                        <p>{project.description}</p>
                        <div className="flex space-x-2">
                            {
                                project.projectSkills.map((skill, index) => {
                                    return <p key={index} className=" bg-slate-200 text-sm border-transparent rounded-full px-2">{skill}</p>
                                })
                            }
                        </div>
                    </div>
                </div>
            </section>
        </article>
    )
}