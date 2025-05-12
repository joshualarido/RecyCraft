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
      detectObject(imageBase64); // only run when base64 is ready
    }
  }, [imageBase64]);

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
      You are to analyze an image of an object and return a response describing it.

      Strictly follow this format below. Do not include any commentary or explanation, only the JSON block:

      {
        "name": "string",                // The name of the item detected
        "description": "string",         // A concise 3-sentence description of the item
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
      <div className='flex flex-col gap-6'>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Item Description</h1>

          <div className="flex flex-row items-stretch gap-4 w-full">
            <img
              src={imageSrc}
              alt="Picture recently taken"
              className="object-cover w-1/4 rounded-lg shadow-lg"
            />
            {itemDetails ? (
              <>
              <div
                className={`flex flex-col text-lg ${
                  itemDetails.recyclable ? 'text-gray-800 bg-white' : 'text-red-800 bg-red-100'
                } rounded-lg p-4 shadow-md w-3/4 justify-center gap-4`}
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
          <h1 className="text-2xl font-bold">Simple Recycle Suggestions</h1>
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