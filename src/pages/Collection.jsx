import CollectionBox from "../components/CollectionBox";
import { useState, useEffect, useRef } from "react";

const Collection = () => {

  const [box, setBox] = useState([]);
  const dbRefColl = useRef(null);
  const dbRefImg = useRef(null);
  const alrdyTransfered = useRef(false);
  const [triggerRender, setTriggerRender] = useState(false);

  useEffect(() => {
    const requestColl = indexedDB.open("collections", 1)
    const requestImg = indexedDB.open("ImageDB", 1)

    requestImg.onupgradeneeded = (event) => {
        const db = event.target.result;
        const store = db.createObjectStore("images", { keyPath: "id" });
        store.createIndex("image", "image", { unique: true });
    };

    requestColl.onupgradeneeded = (event) => {
      console.log("Hey!");
      const db = event.target.result;
      if (!db.objectStoreNames.contains("collBox")) {
        const store = db.createObjectStore("collBox", { keyPath: "id", autoIncrement: true });

        store.createIndex('name', 'name');
        store.createIndex('image', 'image');
        store.createIndex('description', 'description');
        store.createIndex('used', 'used');
      }
    };

    requestColl.onerror = (event) => {
      console.error("An error occurred with IndexedDB", event);
    };
    requestImg.onerror = (event) => {
      console.error("An error occurred with IndexedDB", event);
    };

    let collInitialized = false;
    let imgInitialized = false;
    
    requestColl.onsuccess = (event) => {
      const db = event.target.result;
      dbRefColl.current = db;
      collInitialized = true;
      if(collInitialized && imgInitialized && !alrdyTransfered){
        transfer();
        alrdyTransfered.current = true;
      }
    }
    requestImg.onsuccess = (event) => {
      const db = event.target.result;
      dbRefImg.current = db;
      imgInitialized = true;
      if(collInitialized && imgInitialized && !alrdyTransfered.current){
        transfer();
        display();
        alrdyTransfered.current = true;
      }
    }


  }, []);

  const transfer = () => {
    const dbColl = dbRefColl.current;
    const dbImg = dbRefImg.current;

    
    const transactionImg = dbImg.transaction("images", "readonly");
    const storeImg = transactionImg.objectStore("images");

    const requestImg = storeImg.getAll();

    requestImg.onerror = (event)=>{
      console.error("reading from image idb failed", event);
    }
    requestImg.onsuccess=(event)=>{
      const imgObject = event.target.result;

      if (!imgObject) {
        console.error(`Image with ID ${imageId} not found.`);
        return;
      }

      const newObject = {
        name: "wow",
        image: imgObject[0],
        description: "hey",
        used: false
      }

      const transactionColl = dbColl.transaction("collBox", 'readonly');
      const storeColl = transactionColl.objectStore("collBox");

      const readRequest = storeColl.index("name").get(newObject.name);

      readRequest.onerror = (err) => {
        console.error("Error checking for existing object:", err);
      };
      
      
      readRequest.onsuccess=(event)=>{
        const checker = event.target.result;
        if(checker){
          console.log("Object with the same name already exists, skipping addition.");
        }
        else{
          const transactionColl = dbColl.transaction("collBox", "readwrite");
          const storeColl = transactionColl.objectStore("collBox");
          const addRequest = storeColl.add(newObject);
          addRequest.onsuccess=()=>{
            console.log("Image successfully added to collections.");
          }
          addRequest.onerror = (err) => {
            console.error("Error adding image to collections:", err);
          };
        }
      }      
    }
  }

  const display=()=>{
    const dbColl = dbRefColl.current;
    const transactionColl = dbColl.transaction("collBox", "readwrite");
    const storeColl = transactionColl.objectStore("collBox");

    const readColl = storeColl.getAll();
    readColl.onsuccess=(event)=>{
      const allObjects = event.target.result; 
      console.log("Fetched objects from DB:", allObjects); 
      
      const isUrl = (url) => {
        return typeof url === 'string' && (url.startsWith('http') || url.startsWith('data:image'));
      };

      const updatedObjects = allObjects.map((obj) => {
        if (obj.image && !isUrl(obj.image.image)) {
          const imageUrl = URL.createObjectURL(obj.image.image);
          return { ...obj, image: imageUrl }; // Replace Blob with URL
        }
        return obj; // In case image is already a valid URL or something else
      });

      const initialDefault = [
        { name:"default", image:null, description:"default", used: false},
        { name:"default", image:null, description:"default", used: true},
      ];    

      setBox(prevArray => [...initialDefault, ...updatedObjects]);
    }
    readColl.onerror=(event)=>{
      console.error("display error", event);
    }
  }
  

  function deleteItem(nameKey){
    const dbColl = dbRefColl.current;
    const transactionColl = dbColl.transaction("collBox", "readwrite");
    const storeColl = transactionColl.objectStore("collBox");

    const scanning = storeColl.getAll();
    scanning.onerror =(event)=>{
      console.error("Error retrieving items:", event.target.error);
    };
    scanning.onsuccess =()=>{
      const scanResult = scanning.result;
      
      const match = scanResult.find(item => item.name === nameKey)
      if(match){
        const nameDeleted = match.name;
        const deleteRequest = storeColl.delete(match.id);

        deleteRequest.onerror =(event)=>{
          console.log("Error deleting", event);
        }
        deleteRequest.onsuccess =()=>{
          console.log(`Deleted ${nameDeleted}`);
          setTriggerRender(prev => !prev);
        }
      }
      else{
        console.warn(`No item found with imageblub "${nameKey}".`);
      }
    }

    
  }



  
  const sortedItems = [...box].sort((a, b) => a.used - b.used);
  console.log(box);

  return (
    <div className="p-4 space-y-6">
      <p className="text-xl font-semibold mb-2">All items</p>
      <div className="grid grid-cols-4 gap-4" >
        {sortedItems
        .filter(item => item.description != null && item.description != undefined)
        .map((item, index) => (
          <CollectionBox
            key={index}
            name={item.name}
            image={item.image}
            description={item.description}
            used={item.used}
            onDelete={deleteItem} 
          />
        ))}
      </div>
    </div>
  );
};

export default Collection;
