import { FaRecycle } from "react-icons/fa";
import { FaCamera } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaHammer } from "react-icons/fa";
import { useState } from "react";
import { Link } from 'react-router-dom'

const Sidebar = () => {
    const [active, setActive] = useState("Camera");

    return (
        <>
        <div className="bg-white w-96 h-screen px-6 py-8 flex flex-col gap-8 shadow-xl z-10">
            <div className="flex justify-start items-center gap-4 px-6">
                <h1><FaRecycle className="text-emerald-600 text-3xl" /></h1>
                <h1 className="text-3xl text-emerald-600">Recycraft</h1>
            </div>
            <div className="flex flex-col gap-3 w-full">
                <NavButton name="Camera" icon={<FaCamera />} active={active} setActive={setActive}/>
                <NavButton name="Collection" icon={<MdDashboard />} active={active} setActive={setActive}/>
                <NavButton name="Crafts" icon={<FaHammer />} active={active} setActive={setActive}/>
            </div>
        </div>
        </>
    );
}

const NavButton = ({ name, icon, active, setActive }) => {
    const isActive = active === name;

    return (
        <>
        <Link to={name === "Camera" ? "/" : name.toLowerCase()}>
        <button className={`flex flex-row justify-start items-center gap-4 py-4 px-6 rounded-lg w-full cursor-pointer transition-colors 
                            ${isActive ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-gray-100 text-gray-400'}`}
                onClick={() => setActive(name)}>
            <h2 className="text-xl">{icon}</h2>
            <h2 className="text-md">{name}</h2>
        </button>
        </Link>
        </>
    );
}
 
export default Sidebar;