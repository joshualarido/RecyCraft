import CollectionBox from "../components/CollectionBox";
import { useState, useEffect, useRef } from "react";

const Collection = () => {

  const [box, setBox] = useState([
    {
      name:"default",
      image:"default",
      description:"default",
      used: false
    },
    {
      name:"default",
      image:"default",
      description:"default",
      used: true
    },
  ]);

  const dbRefColl = useRef(null);
  const dbRefImg = useRef(null);

  useEffect(() => {
    const requestColl = indexedDB.open("collections", 1)
    const requestImg = indexedDB.open("ImageDB", 1)

    requestColl.onupgradeneeded = (event) => {
      console.log("Hey!");
      const db = event.target.result;
      if (!db.objectStoreNames.contains("collBox")) {
        const store = db.createObjectStore("collBox", { keyPath: "id", autoIncrement: true });

        store.createIndex('name', 'name');
        store.createIndex('img', 'img');
        store.createIndex('desc', 'desc');
        store.createIndex('used', 'used');
      }
    };

    requestColl.onerror = (event) => {
      console.error("An error occurred with IndexedDB", event);
    };
    requestImg.onerror = (event) => {
      console.error("An error occurred with IndexedDB", event);
    };
    
    requestColl.onsuccess = (event) => {
      const db = event.target.result;
      dbRefColl.current = db;
    }
    requestImg.onsuccess = (event) => {
      const db = event.target.result;
      dbRefImg.current = db;
    }

    if (dbRefColl.current && dbRefImg.current) {
    transfer();
  }

  }, []);

  const transfer = () => {
    const dbColl = dbRefColl.current;
    const dbImg = dbRefImg.current;

    const transactionColl = dbColl.transaction("collBox", "readwrite");
    const storeColl = transactionColl.objectStore("collBox");
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
        name: "default",
        img: imgObject,
        desc: "default",
        used: false
      }

      const addRequest = storeColl.add(newObject);
      addRequest.onsuccess=()=>{
        console.log("Image successfully added to collections.");
      }
      addRequest.onerror = (err) => {
        console.error("Error adding image to collections:", err);
      };
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
            item={item.item}
            image={item.image}
            description={item.description}
            used={item.used}
            // onDelete={deleteItem} 
          />
        ))}
      </div>
    </div>
  );
};

export default Collection;
