import CraftBox from '../components/CraftBox';
import { useState, useEffect } from "react"
import { initDB } from '../../db/indexedDB';
import axios from "axios"
import Crafts from './CraftDetails';
import { IoIosRefresh } from "react-icons/io";

const Camera_Results = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [craftsArray, setCraftsArray] = useState([]);
  const [itemDetails, setItemDetails] = useState(null);
  const [suggestionBatchStarted, setSuggestionBatchStarted] = useState(false);
  const [objectDetected, setObjectDetected] = useState(false);
  const [genImageBase64, setGenImageBase64] = useState(null);
  const [genImageSrc, setGenImageSrc] = useState(null);


  

  // Saves itemDetails to collection
 useEffect(() => {
  if (itemDetails) {
    saveDetails();
  }
}, [itemDetails]);

  useEffect(() => {
  loadImage();
  loadCraftsFromTempAI(); // Load previous suggestions
}, []);

  useEffect(() => {

    if (itemDetails && imageBase64 && !suggestionBatchStarted) {
      generateInitialSuggestions();
      setSuggestionBatchStarted(true);
    }
    
    if (imageBase64 && !objectDetected) {
      detectObject(imageBase64);
      setObjectDetected(true);
    }

  }, [itemDetails, imageBase64]);

  const loadImage = async () => {
    const db = await initDB();
    const tx = db.transaction("camera", "readonly");
    const store = tx.objectStore("camera");

    const request = store.get(1); // fixed ID

    request.onsuccess = async (e) => {
      const record = e.target.result;
      if (record && record.image instanceof Blob) {
        const base64 = await blobToBase64(record.image);
        const objectURL = URL.createObjectURL(record.image);
        
        setImageBase64(base64);
        setImageSrc(objectURL); // for <img>

      } else {
        console.warn("No image found in store");
      }
    };

    request.onerror = (e) => {
      console.error("Failed to load image:", e);
    };
  };

  // Converts blob file to base64
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]); // strip the data:image/... part
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const saveDetails=async()=>{
    const db = await initDB()
    const transaction = db.transaction("collections", "readwrite")
    const store = transaction.objectStore("collections")

    const request = await store.put({ name: itemDetails.item, image:imageSrc, description: itemDetails.description, used:false })
    request.onerror=(error)=>console.error("Failed to put descriptions in collection idb", error)
    request.onsuccess=()=>console.log("Descriptions successfully in collections idb");
  }

  const detectObject = async (image) => {
    const prompt = `
      You are to analyze an image of an object and return a response describing it.

      Strictly follow this format below. Do not include any commentary or explanation, only the string text block with no other formatting in this template:

      {
        "name": "string",                // The name of the item detected
        "description": "string",         // A concise 3-sentence description of the item, ignoring the environment of the item.
        "size_estimate": "string",       // Estimate the size in the format L x W x H, e.g., "30cm x 20cm x 10cm"
        "recyclable": true | false       // Use a boolean: true if it can be reused/recycled, false if not
      }

      Do NOT use triple backticks or any Markdown formatting.
      It must be reiterated that the start of the output should NOT start with \`\`\`JSON or end with \`\`\` either.
    `

    try {
      const res = await axios.post("/gemini/text", { prompt, image });
      const reply = res.data.reply.text;

      // Attempt to parse the AI's response as JSON
      let parsed;
      try {
        parsed = JSON.parse(reply);
        setItemDetails(parsed);
        
        console.log("Parsed Gemini object detection:", parsed);
      } catch (jsonError) {
        console.error("Failed to parse Gemini reply as JSON:", jsonError);
        console.log("Raw reply from Gemini:", reply);
      }
      
    } catch (error) {
      console.error("Error calling Gemini API:", error);
    }
  };

    const loadCraftsFromTempAI = async () => {
  const db = await initDB();
  const tx = db.transaction("tempAI", "readonly");
  const store = tx.objectStore("tempAI");

  const request = store.getAll();
  request.onsuccess = () => {
    setCraftsArray(request.result);
  };
};

  const clearTempAI = async () => {
  const db = await initDB();
  const tx = db.transaction("tempAI", "readwrite");
  const store = tx.objectStore("tempAI");

  const clearRequest = store.clear();

  clearRequest.onsuccess = () => {
    console.log("Cleared tempAI store");
    setCraftsArray([]); // Reset UI list
    setSuggestionBatchStarted(false); // Allow regenerate
    generateInitialSuggestions(); // Trigger regeneration
  };

  clearRequest.onerror = (e) => {
    console.error("Failed to clear tempAI store:", e);
  };
};

  const createSuggestion = async (image) => {
    const prompt = `
      You are to analyze an image of an object and return one of several possible recyclable ideas made out of it.
      Think creatively and provide new ideas. Avoid repeating suggestions.

      Strictly follow this format below. Do not include any commentary or explanation, only the string text block with no other formatting in this template:

      {
        "name": "string",         // Name of decided craft
        "description": "string",  // Concise description of craft, 1-2 sentences. Assume the user does not have an image of the craft and is only able to use this description as a means of seeing the object.
        "image": "string",        // Leave empty on output for now
        "steps": [                // Steps as to what the user must do in order to make this craft by themselves.
          "string",       
          "string",
          "string"                // There can be more than 3 steps if needed. make the steps detailed 
        ]
      }

      Do NOT use triple backticks or any Markdown formatting.
      It must be reiterated that the start of the output should NOT start or end with \`\`\` either.
    `;

    try {
      const res = await axios.post("/gemini/text", { prompt, image });
      const reply = res.data.reply.text;

      let parsed;
      try {
        const parsed = JSON.parse(reply);
        const imageSrc = await generateImage(parsed.name, parsed.description);
        parsed.image = imageSrc; 
        parsed.progress = 0;

        const db = await initDB();
         const tx = db.transaction("tempAI", "readwrite");
        const store = tx.objectStore("tempAI");
        const request = store.add({
        title: parsed.name,
        description: parsed.description,
        image: parsed.image,
        steps: parsed.steps,
        progress: parsed.progress,
      });

       request.onsuccess = () => {
        console.log("Saved generated craft to tempAI");
        loadCraftsFromTempAI(); 
      };

        
        console.log("Parsed Gemini suggestion:", genImageSrc);
      } catch (jsonError) {
        console.error("Failed to parse Gemini reply as JSON:", jsonError);
        console.log("Raw reply from Gemini:", reply);
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
    }
  };

 const generateInitialSuggestions = async () => {
  const db = await initDB();
  const tx = db.transaction("tempAI", "readonly");
  const store = tx.objectStore("tempAI");
  
  const getAllRequest = store.getAll();
  
  getAllRequest.onsuccess = async () => {
    const existing = getAllRequest.result;
    const remaining = 4 - existing.length;

    if (remaining <= 0) {
      console.log("Already have 4 suggestions. Skipping generation.");
      return;
    }

    for (let i = 0; i < remaining; i++) {
      await createSuggestion(imageBase64);
    }

    await loadCraftsFromTempAI();
  };

  getAllRequest.onerror = (e) => {
    console.error("Failed to count existing suggestions:", e);
  };
};

  const generateImage = async (item, description) => {
    const prompt = `
      Generate an image of a/an ${item}.
      Description: ${description}
      Make it photorealistic, and the only subject of the scene.
    `;

    try {
      const res = await axios.post("/gemini/image", { prompt });
      const reply = res.data.reply;

      const imageSrc = base64ToImageSrc(reply.image, reply.mimeType);
      console.log("Gemini image generation:", imageSrc);

      return imageSrc; // ✅ return the formatted image string
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return null;
    }
  };


  const base64ToImageSrc = (base64, mimeType = "image/png") => {
    return `data:${mimeType};base64,${base64}`;
  };

  return (
      <>
      <div className='flex flex-col gap-6'>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Item Description</h1>

          <div className="flex flex-row items-stretch gap-4 w-full max-sm:flex-col">
            <img
              src={imageSrc}
              alt="Picture recently taken"
              className="object-cover w-1/4 rounded-lg shadow-lg max-sm:w-full"
            />
            {itemDetails ? (
              <>
              <div
                className={`flex flex-col text-lg ${
                  itemDetails.recyclable ? 'text-gray-800 bg-white' : 'text-red-800 bg-red-100'
                } rounded-lg p-4 shadow-md w-3/4 justify-center gap-4 max-sm:w-full`}
              >
                <p
                  className={`text-lg font-medium ${
                    itemDetails.recyclable
                      ? 'text-emerald-600 bg-emerald-100'
                      : 'text-red-600 bg-red-200'
                  } px-3 py-1 rounded-full w-fit`}
                >
                  {itemDetails.recyclable ? 'Recyclable' : 'Non-Recyclable'}
                </p>
                <div className="flex flex-col gap-4">
                  <p>
                    <strong>Item</strong>: {itemDetails.name}
                  </p>
                  <p>
                    <strong>Description</strong>: {itemDetails.description}
                  </p>
                  <p>
                    <strong>Size</strong>: {itemDetails.size_estimate}
                  </p>
                </div>
              </div>
              </>
            ) : (
              <h1>Loading...</h1>
            )}
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Simple Recycle Suggestions</h1>
          <button className="text-2xl text-gray-600 hover:text-black transition" onClick={clearTempAI}><IoIosRefresh /></button>
          </div>
          <div className="flex flex-row justify-between gap-4">
            {craftsArray.length > 0 ? (
              craftsArray.map((craft, index) => (
                <CraftBox
                  key={index}
                 craft={craft}
                item={craft.title}
                 image={craft.image}
                 description={craft.description}
                 steps={craft.steps}
                 aiOutput={craft}
                 saved={false}
                />
               ))
                ) : (
                   <h1>Loading...</h1>
                )}
          </div>
        </div>


        <div className='flex flex-col gap-4'>
          <h1 className="text-2xl font-bold">Multifaceted Recycle Suggestions</h1>
          
          <div className="flex justify-between gap-4">
            <CraftBox 
              item="Bottle Planter 5"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/>
            <CraftBox 
              item="Bottle Planter 5"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/>
            <CraftBox 
              item="Bottle Planter 5"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/>
            <CraftBox 
              item="Bottle Planter 5"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/>
          </div>
        </div>
      </div>
      </>
  );
}

export default Camera_Results;