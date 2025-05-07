import React, { useRef, useCallback, useState } from "react"
import Webcam from "react-webcam"
import { FaImage } from "react-icons/fa";
import { IoIosFlash } from "react-icons/io";
import { FaCamera } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaHammer } from "react-icons/fa";
import { VscDebugRestart } from "react-icons/vsc";

import { Link } from "react-router-dom";
import Camera_Results from "./Camera_Results";

const Camera = () => {
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null)
    const [image, setImage] = useState(null);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
    }, [webcamRef])

    const reset = () => {
        setImage(null);
    }

    const triggerFileSelect = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = (e) => {
        console.log("works")
        const file = e.target.files[0]
        if(!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            const result = reader.result
            setImage(result)
        }

        reader.readAsDataURL(file)
    }

    return (
        <>
        <div className="flex flex-col w-full h-full gap-4">
            <h1 className="text-2xl font-semibold">Camera</h1>
            <div className="flex justify-center items-center w-full rounded-xl overflow-hidden bg-emerald-950 shadow-lg">
                {image ? (
                    <img
                    src={image}
                    alt="captured"
                    className="w-content h-full object-cover"
                    />
                ) : (
                    <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full"
                    videoClassName="w-full h-full object-cover"
                    />
                )}
            </div>
            <div className="flex flex-row w-full justify-center items-center">
                {image ? (
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-col justify-center items-center py-4 px-6 gap-2 text-gray-400 cursor-pointer bg-white
                                        rounded-xl shadow-lg hover:bg-gray-100 transition duration-200"
                            onClick={() => reset()}>
                            <h1 className="text-3xl"><VscDebugRestart /></h1>
                            <h4 className="text-md">Retake Image</h4>
                        </div>
                        <div className="flex flex-col justify-center items-center py-4 px-6 gap-2 text-gray-400 cursor-pointer bg-white
                                        rounded-xl shadow-lg hover:bg-gray-100 transition duration-200">
                            <h1 className="text-3xl"><MdDashboard /></h1>
                            <h4 className="text-md">Save to Collections</h4>
                        </div>
                        <Link to="/camera_results">                    
                            <div className="flex flex-col justify-center items-center py-4 px-6 gap-2 text-gray-400 cursor-pointer
                                            rounded-xl shadow-lg bg-emerald-100 hover:bg-emerald-200 transition duration-200">
                                <h1 className="text-3xl text-emerald-500"><FaHammer /></h1>
                                    <h4 className="text-md text-emerald-500">Save to Collections</h4>
                            </div>
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-row w-fit bg-white shadow-lg py-4 px-6 rounded-xl justify-center items-center gap-6">
                        <div className="flex flex-col justify-center items-center p-2 gap-2 text-gray-400 cursor-pointer"
                            onClick={() => triggerFileSelect()}>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <h1 className="text-3xl"><FaImage /></h1>
                            <h4 className="text-md">Import</h4>
                        </div>
                        <h1 className="text-3xl bg-emerald-100 p-6 rounded-full text-emerald-600 cursor-pointer"
                            onClick={() => capture()}><FaCamera /></h1>
                    </div>
                )}
            </div>
        </div>
        </>
    );
}
 
export default Camera;