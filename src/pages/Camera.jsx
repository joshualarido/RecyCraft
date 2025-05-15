import React, { useRef, useCallback, useState, useEffect } from "react"
import Webcam from "react-webcam"
import { initDB } from "../../db/indexedDB";
import { FaImage } from "react-icons/fa";
import { IoIosFlash } from "react-icons/io";
import { FaCamera } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaHammer } from "react-icons/fa";
import { VscDebugRestart } from "react-icons/vsc";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"

const Camera = () => {
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null)
    const [image, setImage] = useState(null);
    const [itemDetails, setItemDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const capture = useCallback(async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);

        const blob = base64ToBlob(imageSrc);
        console.log(blob)

         try {
        const db = await initDB();
        const tx = db.transaction("tempAI", "readwrite");
        const store = tx.objectStore("tempAI");
        store.clear(); // This clears all entries in tempAI
        tx.oncomplete = () => console.log("tempAI cleared before capture.");
        tx.onerror = (e) => console.error("Error clearing tempAI:", e);
    } catch (e) {
        
        console.error("DB error while clearing tempAI:", e);
    }
        await saveImageToCameraIdb(blob);
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
            await saveImageToCameraIdb(blob);
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

    const saveImageToCameraIdb = async (blob) => {
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

    // scenario where save to collections is clicked, must generate details
    const detectObject = async (image) => {
        const prompt = `
            You are to analyze an image of an object and return a response describing it.

            Strictly follow this format below. Do not include any commentary or explanation, only the string text block with no other formatting in this template:

            {
                "name": "string",                // The name of the item detected
                "description": "string",         // A concise 3-sentence description of the item, ignoring the environment of the item. describe it straightforwardly skipping buzzwords and start with an immediate "A/An...", no saying what is "visible", just say it how it is and describe the image instead of trying to tell someone what you see. Avoid pronoun usage.
                "size_estimate": "string",       // Estimate the size in the format L x W x H, e.g., "30cm x 20cm x 10cm"
                "recyclable": true | false       // Use a boolean: true if it can be reused/recycled, false if not. Recyclable is defined by the ability to make something new from the current item being parsed. avoid marking true if the item is organic, looks expensive, or looks like absolute junk that has barely any uses and cannot be made into much stuff.
            }

            Do NOT use triple backticks or any Markdown formatting.
            It must be reiterated that the start of the output should NOT start with \`\`\`JSON or end with \`\`\` either.
        `;

        try {
            const res = await axios.post("/gemini/text", { prompt, image });
            const reply = res.data.reply.text;

            let parsed;
            try {
                parsed = JSON.parse(reply);
                setItemDetails(parsed);
                
                console.log("Parsed Gemini object detection:", parsed);
            } catch (jsonError) {
                console.error("Failed to parse Gemini reply as JSON:", jsonError);
                console.log("Raw reply from Gemini:", reply);
            }

            return parsed;
        } catch (error) {
            console.error("Object detection failed:", error);
            return null;
        }
    };

    const saveDetails=async()=>{
        const db = await initDB()
        const transaction = db.transaction("collections", "readwrite")
        const store = transaction.objectStore("collections")
        if(!itemDetails){
            return;
        }
        const request = await store.put({ name: itemDetails.name, image:image, description: itemDetails.description, used:false })
        request.onerror=(error)=>console.error("Failed to put descriptions in collection idb", error)
        request.onsuccess=()=>console.log("Descriptions successfully in collections idb");
    }
    
    // useEffect(()=>{
    //     saveDetails();
    //     console.log("Details saved!");
    // }, [itemDetails])

  

    const handleClickSave = async () => {
        setLoading(true);
        try {
            const base64Image = image.includes("base64,") ? image.split("base64,")[1] : image;
            const parsed = await detectObject(base64Image);

            if (!parsed) throw new Error("No object detected");

            const db = await initDB();
            const tx = db.transaction("collections", "readwrite");
            const store = tx.objectStore("collections");

            await new Promise((resolve, reject) => {
            const request = store.put({
                name: parsed.name,
                image: image,
                description: parsed.description,
                used: false
            });

            request.onsuccess = () => {
                console.log("Saved to collections successfully");
                resolve(); // continue to navigate
            };

            request.onerror = (e) => {
                console.error("Failed to write to IndexedDB:", e);
                reject(e);
            };
            });

            navigate("/collection");
        } catch (error) {
            console.error("Error during save flow:", error);
        } finally {
            setLoading(false); // Always reset loading
        }
    };


    if (loading) {
        return (
        <div className="flex justify-center items-center h-screen">
            <h2 className="text-xl text-gray-600">Loading...</h2>
            <div className="flex items-center justify-center px-10">
                <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
        </div>
        );
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
                    <div className="flex flex-wrap justify-center gap-4 w-full">
                        <div className="flex flex-col justify-center items-center py-4 px-6 gap-2 text-gray-400 cursor-pointer bg-white
                                        rounded-xl shadow-lg hover:bg-gray-100 transition duration-200 w-full max-sm:w-full sm:w-auto min-w-[140px]"
                            onClick={() => reset()}>
                            <h1 className="text-3xl"><VscDebugRestart /></h1>
                            <h4 className="text-md text-center w-full">Retake Image</h4>
                        </div>
                        <div onClick={handleClickSave} className="flex flex-col justify-center items-center py-4 px-6 gap-2 text-gray-400 cursor-pointer bg-white
                                        rounded-xl shadow-lg hover:bg-gray-100 transition duration-200">
                            <h1 className="text-3xl"><MdDashboard /></h1>
                            <h4 className="text-md">Save to Collections</h4>
                        </div>
                        <Link to="/camera_results">          
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