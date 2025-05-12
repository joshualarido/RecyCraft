import CraftBox from '../components/CraftBox';
import { useState, useEffect } from "react"
import { initDB } from '../../db/indexedDB';
import axios from "axios"

const Camera_Results = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [itemDetails, setItemDetails] = useState(null);

  useEffect(() => {
    loadImage();
  }, []);

  useEffect(() => {
    if (imageBase64) {
      const itemDetails = detectObject(imageBase64); // only run when base64 is ready
      setItemDetails()
    }
  }), [imageBase64];

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

  const detectObject = async (image) => {
    const prompt = `
      You are to analyze an image of an object and return a JSON response describing it.

      Strictly follow this format below. Do not include any commentary or explanation, only the JSON block:

      {
        "name": "string",                // The name of the item detected
        "description": "string",         // A concise 3-sentence description of the item
        "size_estimate": "string",       // Estimate the size in the format L x W x H, e.g., "30cm x 20cm x 10cm"
        "recyclable": true | false       // Use a boolean: true if it can be reused/recycled, false if not
      }

      Only respond with the pure JSON object. Do NOT use triple backticks or any Markdown formatting. In the order defined.
    `

    try {
      const res = await axios.post("/gemini/text", { prompt, image });
      const reply = res.data.reply.text;

      // Attempt to parse the AI's response as JSON
      let parsed;
      try {
        parsed = JSON.parse(reply);
        console.log("Parsed Gemini output:", parsed);
      } catch (jsonError) {
        console.error("Failed to parse Gemini reply as JSON:", jsonError);
        console.log("Raw reply from Gemini:", reply);
      }
      
    } catch (error) {
      console.error("Error calling Gemini API:", error);
    }
  };

  
  const scenario = Math.random() < 0.5 ? 0 : 1;

  const config = scenario === 0
  ? {
      label: 'Recyclable',
      labelColor: 'text-emerald-600 bg-emerald-100',
      item: 'Plastic Bag',
      description: 'This is scenario 0: recyclable material.',
      recyclability: 'It can be recycled at most centers.',
      textColor: 'text-gray-800',
      bgColor: 'bg-white'
    }
  : {
      label: 'Non-Recyclable',
      labelColor: 'text-red-600 bg-red-200',
      item: 'Plastic Wrapper',
      description: 'This is scenario 1: non-recyclable material.',
      recyclability: 'This item is not suitable for recycling due to contamination or material makeup.',
      textColor: 'text-red-800',
      bgColor: 'bg-red-100'
    };

  return (
      <>
      <h1 className="text-2xl font-bold py-2">Item Description</h1>

      <div className="flex items-stretch gap-4 min-h-[150px]">
          <img src={imageSrc} alt="Picture recently taken" className="card h-150 bg-base-100 shadow-xl" />
          <div className={`text-2xl ${config.textColor} ${config.bgColor} rounded-lg p-4 shadow-md inline-block relative`}>
            <p className={`text-m font-medium ${config.labelColor} px-3 py-1 rounded-full w-fit`}>
              {config.label}
            </p>
            <p className="py-3"><strong>Item</strong>: {config.item}</p>
            <p className="py-3"><strong>Description</strong>: {config.description}</p>
            <p className="py-3"><strong>Recyclability</strong>: {config.recyclability}</p>
          </div>
      </div>


      <h1 className="text-2xl font-bold py-10">Simple Recycle Suggestions</h1>
      <div className="flex justify-start gap-8">
          <div><CraftBox 
          item="Bottle Planter 5"
          image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/></div>
          <div><CraftBox 
          item="Bottle Planter 5"
          image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/></div>
          <div><CraftBox 
          item="Bottle Planter 5"
          image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/></div>
          <div><CraftBox 
          item="Bottle Planter 5"
          image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/></div>
      </div>
      <h1 className="text-2xl font-bold py-10">Multifaceted Recycle Suggestions</h1>
      <div className="flex justify-start gap-8">
      <div><CraftBox 
          item="Bottle Planter 5"
          image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/></div>
          <div><CraftBox 
          item="Bottle Planter 5"
          image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/></div>
          <div><CraftBox 
          item="Bottle Planter 5"
          image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/></div>
          <div><CraftBox 
          item="Bottle Planter 5"
          image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/></div>
      </div>
      
      </>
  );
}

export default Camera_Results;