import { ProjectBanner } from "../components/ProjectBanner"

export function LandingPage(){

    const dummyProject = {
        id: 3,
        adminId: 4,
        industryId: 5,
        projectName: "Emma's climbing",
        description: "An amazing chance to join the awesome mountain adventures!",
        projectUrl: "???",
        image: "https://i.ibb.co/BnVKY5t/Programmer-Profile-Picture.jpg",
        projectSkills: ["Climbing", "Outdoor", "Social", "Teamwork"],
    }

    return(
        <main className="flex ex-col justify-center">
            <ProjectBanner project={dummyProject} />
        </main>
    )
}