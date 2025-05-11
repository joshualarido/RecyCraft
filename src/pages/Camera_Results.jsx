import CraftBox from '../components/CraftBox';
import { useState, useEffect } from "react"

const Camera_Results = () => {
  const [imageSrc, setImageSrc] = useState(""); // State to hold the image URL

  useEffect(() => {
    loadImageFromDB((url) => {
      setImageSrc(url); 
    });
  }, []);

  

  const loadImageFromDB = (callback) => {

    const request = indexedDB.open("ImageDB", 1);
  
      request.onerror = (event) => {
        console.error("Error opening IndexedDB", event);
      };
    
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("images", "readonly");
        const store = transaction.objectStore("images");
        const getRequest = store.get(1);
    
        getRequest.onsuccess = () => {
          const result = getRequest.result;
          if (result && result.image instanceof Blob) {
            const imageURL = URL.createObjectURL(result.image);
            callback(imageURL);
          } else {
            console.warn("No image found in IndexedDB");
          }
        };
      };
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

      <div className="flex items-center items-stretch gap-4 min-h-[150px]">
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