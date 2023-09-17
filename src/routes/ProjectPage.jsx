import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDate } from '../utils/date';

export function ProjectPage(){

    const { projectId } = useParams();
    const { keycloak, initialized } = useKeycloak();
    const [project, setProject] = useState(null);
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [motivation, setMotivation] = useState("");
    const [admin, setAdmin] = useState(null);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    useEffect(() => {
        const fetchProject = async () => {
            const response = await fetch(`https://localhost:7291/api/Project/${projectId}`);
            const data = await response.json();
            setProject(data);
        };
        fetchProject();
    },[projectId]);

    useEffect(() => {
        const fetchAdmin = async () => {
            const response = await fetch(`https://localhost:7291/api/Admin/${project.userId}/projects`);
            const data = await response.json();
            if(data.length > 0)
            {
                setAdmin(data[0]);
            }
        };
        if(project) {
            fetchAdmin();
        }  
    },[project]);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`https://localhost:7291/api/Users/UniqueUser/${keycloak.subject}`);
            const data = await response.json();
            setUser(data);
        };
        if(initialized && keycloak.authenticated)
        {
            fetchUser();
        }
    },[keycloak.subject]);

    useEffect(() => {
        const fetchComments = async () => {
            const response = await fetch(`https://localhost:7291/api/Comment/${project.id}/comments`);
            const commentData = await response.json();

            const commentsWithUsers = await Promise.all(
                commentData.map(async (comment) => {
                  // Fetch the user for each comment
                  const userResponse = await fetch(`https://localhost:7291/api/Users/${comment.userId}`);
                  const userData = await userResponse.json();
                  
                  // Combine comment and user data
                  return { ...comment, user: userData };
                })
            );

            setComments(commentsWithUsers);
        };
        if(project) {
            fetchComments();
        } 
    }, [project]);

    const createProjectApplication = async () => {
        const url = "https://localhost:7291/api/ProjectApplication";
        const data = {
            "userId": user.id,
            "projectId": project.id,
            "adminId": admin.id,
            "status": true,
            "motivation": motivation
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
                alert("Motivation sent successfully");
            } else {
                alert("motivation failed to send");
            }
        } catch(error) {
            alert("An error occured while creating the motivation");
        };
    };

    const createComment = async () => {
        const url = "https://localhost:7291/api/Comment";
        const data = {
            "userId": user.id,
            "projectId": project.id,
            "text": comment,
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
                const data = await response.json();
                const userResponse = await fetch(`https://localhost:7291/api/Users/${data.userId}`);
                const userData = await userResponse.json();
                  
                // Combine comment and user data
                const newComment = { ...data, user: userData };
                setComments((prev) => [...prev, newComment]);
                setComment("");
            } else {
                alert("Comment failed to send");
            }
        } catch(error) {
            alert("An error occured while creating the comment");
        };
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        createProjectApplication();
        setOpen(false);
    }

    const handleNewCommentSubmit = (event) => {
        event.preventDefault();
        createComment();
    }

    const deleteComment = async (commentId) => {
        const response = await fetch(`https://localhost:7291/api/Comment/${commentId}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            setComments((prev) => prev.filter(comment => comment.id !== commentId));
        }
    }

    return(
        <main className="flex justify-start p-12">
            {
                project ? (
                    <div className="flex space-x-8">
                        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
                            <img className="w-full" src={project.image} width={100} height={100} alt="image" />
                            <div className="flex justify-start pl-4 pt-4">
                                <h2 className="font-light text-lg">{project.projectName}</h2>
                            </div>
                            <div className="px-2 flex flex-col justify-start pl-4">
                                <p>Description {project.description}</p>
                                <div className="flex justify-center mt-1 p-4">
                                    {
                                        keycloak.authenticated && ( 
                                            <button className="bg-gradient-to-r from-teal-300 to-blue-500 text-white text-white font-normal active:bg-emerald-600 hover:bg-emerald-300 hover:from-blue-500 hover:to-teal-200 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" onClick={() => setOpen(true)}>Join Project</button>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                            {
                                keycloak.authenticated && (
                                    <form className="flex flex-col" onSubmit={handleNewCommentSubmit}>
                                        <label className="font-semibold">
                                            Write a new comment
                                        </label>
                                        <textarea 
                                            rows="4" 
                                            className="w-full border-2 border-sky-200 pl-2 py-1 hover:border-sky-400 focus:outline-none focus:ring focus:ring-sky-300" 
                                            value={comment} 
                                            onChange={(event) => setComment(event.target.value)} 
                                        />
                                        <div className="flex justify-start pt-2">
                                            <input className="w-32 bg-gradient-to-r from-teal-300 to-blue-500 text-white px-5 py-2 rounded-full p-2 hover:from-blue-500 hover:to-teal-200 font-normal mb-10 cursor-pointer" type="submit" value="Comment"/>
                                        </div>
                                    </form>
                                )
                            }
                            {
                                comments.map((comment) => (
                                    <div className="flex space-x-2" key={comment.id}>
                                        <div className="flex flex-col border-2 p-2 w-[300px]">
                                            <p className="italic">{comment.user.fullName} - {formatDate(comment.createdDate)}</p>
                                            <p>{comment.text}</p>
                                        </div>
                                        {
                                            (user && comment.userId === user.id) && (
                                                <div className="flex flex-col items-start justify-end">
                                                    <button className="text-red-500 cursor-pointer" onClick={() => deleteComment(comment.id)}>Delete</button>
                                                </div>
                                            )
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ) : (
                    <p>Loading project details...</p>
                )
            }
            {
                open ? (
                    <>
                        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                        <h3 className="text-3xl font-semibold">
                                            Join project
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
                        
                                    <form className="relative p-6 flex-auto" onSubmit={handleSubmit}>
                                        <div className="flex flex-col">
                                            <label className="font-semibold">
                                                Your Motivation 
                                            </label>
                                            <textarea placeholder="Write your motivation here" className="my-4 text-slate-500 text-lg leading-relaxed" value={motivation} onChange={(event) => setMotivation(event.target.value)}/>
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