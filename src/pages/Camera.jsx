import React, { useRef, useCallback, useState, useEffect } from "react"
import Webcam from "react-webcam"
import { initDB } from "../../db/indexedDB";
import { FaImage } from "react-icons/fa";
import { IoIosFlash } from "react-icons/io";
import { FaCamera } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaHammer } from "react-icons/fa";
import { VscDebugRestart } from "react-icons/vsc";
import { Link } from "react-router-dom";

const Camera = () => {
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null)
    const [image, setImage] = useState(null);

    const capture = useCallback(async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);

        const blob = base64ToBlob(imageSrc);
        console.log(blob)
        await saveImageToIndexedDB(blob);
    }, [webcamRef]);

    const reset = () => {
        setImage(null);
    }

    const triggerFileSelect = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = async () => { // What the reader does when it's finished reading file
            const result = reader.result;
            setImage(result);

            const blob = base64ToBlob(result);
            await saveImageToIndexedDB(blob);
        };

        reader.readAsDataURL(file); // Read file
    };

    const base64ToBlob = (base64Data) => {
        const [header, base64] = base64Data.split(',');
        const mime = header.match(/:(.*?);/)[1];
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);

        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }

        return new Blob([bytes], { type: mime });
    };

    const saveImageToIndexedDB = async (blob) => {
        const db = await initDB(); // access already defined DB
        const tx = db.transaction("camera", "readwrite"); // open transaction in table "images" for reading and writing
        const store = tx.objectStore("camera");

        const request = store.put({ id: 1, image: blob }); // store item, only 1 image stored at a time
        request.onsuccess = () => console.log("Put successful");
        request.onerror = (e) => console.error("Put error", e);

        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = (e) => reject(e);
        });
    };

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
                    <div className="flex flex-wrap justify-center gap-4 w-full">
                        <div className="flex flex-col justify-center items-center py-4 px-6 gap-2 text-gray-400 cursor-pointer bg-white
                                        rounded-xl shadow-lg hover:bg-gray-100 transition duration-200 w-full max-sm:w-full sm:w-auto min-w-[140px]"
                            onClick={() => reset()}>
                            <h1 className="text-3xl"><VscDebugRestart /></h1>
                            <h4 className="text-md text-center w-full">Retake Image</h4>
                        </div>
                        <Link to="/collection" className="w-full max-sm:w-full sm:w-auto min-w-[140px]">         
                            <div className="flex flex-col justify-center items-center py-4 px-6 gap-2 text-gray-400 cursor-pointer bg-white
                                            rounded-xl shadow-lg hover:bg-gray-100 transition duration-200 w-full max-sm:w-full sm:w-auto min-w-[140px]">
                                <h1 className="text-3xl"><MdDashboard /></h1>
                                <h4 className="text-md text-center w-full">Save to Collections</h4>
                            </div>
                        </Link>
                        <Link to="/camera_results" className="w-full max-sm:w-full sm:w-auto min-w-[140px]">                    
                            <div className="flex flex-col justify-center items-center py-4 px-6 gap-2 text-gray-400 cursor-pointer
                                            rounded-xl shadow-lg bg-emerald-100 hover:bg-emerald-200 transition duration-200 w-full max-sm:w-full sm:w-auto min-w-[140px]">
                                <h1 className="text-3xl text-emerald-500"><FaHammer /></h1>
                                <h4 className="text-md text-center w-full text-emerald-500">See Possible Crafts</h4>
                            </div>
                        </Link>
                    </div>

                ) : (

                    <div className="flex flex-row w-fit bg-white shadow-lg py-4 px-6 rounded-xl justify-center items-center gap-6">
                        <div className="flex flex-col justify-center items-center gap-2 text-gray-400 cursor-pointer"
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