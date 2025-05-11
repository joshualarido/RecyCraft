import React, { useRef, useCallback, useState, useEffect } from "react"
import Webcam from "react-webcam"
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
    const dbRef = useRef(null)
    const [image, setImage] = useState(null);

         // To store the IndexedDB references
    
    // Initialize the IndexedDB
    useEffect(() => {
        const request = indexedDB.open("ImageDB", 1);
    
        // Error handling
        request.onerror = (event) => {
        console.error("An error occurred with IndexedDB", event);
        };
    
        // On upgrade or initial setup
        request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const store = db.createObjectStore("images", { keyPath: "id" });
        store.createIndex("image", "image", { unique: true });
        };
    
        // On successful open
        request.onsuccess = (event) => {
            const db = event.target.result;
            dbRef.current = db; // Store the DB reference in useRef
        }
    }, []);
    
    const saveImageToDB = (file) => {
        const db = dbRef.current;

        if (!db) {
            console.error("Database is not ready yet");
            return;
        }

        // Extract base64 data and content type
        const [header, base64] = file.split(',');
        const mimeMatch = header.match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'image/png';

        // Convert base64 to binary
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }

        const imageBlob = new Blob([bytes], { type: mime });
        console.log(imageBlob)

        // Store the Blob in IndexedDB
        const transaction = db.transaction("images", "readwrite");
        const store = transaction.objectStore("images");
        store.put({ id: 1, image: imageBlob });

        console.log("Image stored in IndexedDB");
      };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        saveImageToDB(imageSrc);

        setImage(imageSrc);
        console.log(imageSrc)
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
            saveImageToDB(result);
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
                        <Link to="/collection">         
                            <div className="flex flex-col justify-center items-center py-4 px-6 gap-2 text-gray-400 cursor-pointer bg-white
                                            rounded-xl shadow-lg hover:bg-gray-100 transition duration-200">
                                <h1 className="text-3xl"><MdDashboard /></h1>
                                <h4 className="text-md">Save to Collections</h4>
                            </div>
                        </Link>
                        <Link to="/camera_results">                    
                            <div className="flex flex-col justify-center items-center py-4 px-6 gap-2 text-gray-400 cursor-pointer
                                            rounded-xl shadow-lg bg-emerald-100 hover:bg-emerald-200 transition duration-200">
                                <h1 className="text-3xl text-emerald-500"><FaHammer /></h1>
                                    <h4 className="text-md text-emerald-500">Go to Crafts</h4>
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