import { useContext } from "react";
import { AppContext } from "../App";

export function LoginModal({ open }) {

    const { setLoginModalOpen } = useContext(AppContext);

    if (!open) return null;

    return (
        <dialog className="flex justify-center items-center absolute top-0 left-0 z-20 w-screen h-screen backdrop-blur-sm bg-black bg-opacity-25">
          <div className="flex flex-col space-y-2 w-1/5 bg-white border-transparent rounded shadow-md p-4">
            <div className="flex justify-end">
              <icon onClick={() => setLoginModalOpen(false)} className="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </icon>
            </div>
            <div className="flex space-x-16 pb-8">
                <h1 className="font-bold text-lg">Log In</h1>
            </div>
            <div className="flex justify-center">
              <button className="rounded-full bg-blue-500 px-4 py-1">Facebook</button>
            </div>
            <div className="flex justify-center">
              <button className="rounded-full bg-red-500 px-4 py-1">Google</button>
            </div>
          </div>
        </dialog>
    )
}