import CollectionBox from "../components/CollectionBox";
import { useState, useEffect } from "react";

const Collection = () => {

  const [box, setBox] = useState([
    {
      item: null,
      image: null,
      description: null,
      used: null,
    }
  ]);
  
  const deleteItem = (itemId) => {
    const request = indexedDB.open("collections", 1);
    console.log("item ID is");
    console.log({itemId});
    request.onsuccess = (event) => {
      
      const db = event.target.result;
      const transaction = db.transaction("collBox", "readwrite");
      const store = transaction.objectStore("collBox");

      const deleteRequest = store.delete(itemId);

      deleteRequest.onsuccess = () => {
        console.log("Item deleted successfully.");
      };
  
      deleteRequest.onerror = () => {
        console.error("Error deleting item:", deleteRequest.error);
      };
    };

    request.onerror = function () {
      console.error("Error opening/creating collections:", request.error);
    };
  };

  useEffect(() => {
    const request = indexedDB.open('collections', 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      const objectStore = db.createObjectStore('collBox', {
        keyPath: 'id',
        autoIncrement: true
      });

      objectStore.createIndex('name', 'name', { unique: true });
      objectStore.createIndex('image', 'image', { unique: true });
      objectStore.createIndex('description', 'desc', { unique: false });
      objectStore.createIndex('used', 'used', { unique: false });

      console.log('collections with "collBox" store created.');
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction("collBox", "readwrite");

      const store = transaction.objectStore("collBox");
      const cursor = store.openCursor();

      const newBox = [...box];

      cursor.onsuccess = (event) => {
        const cursored = event.target.result;

        if (cursored) {
          newBox.push({
            item: cursored.value.name,
            image: cursored.value.image,
            description: cursored.value.desc,
            used: cursored.value.used
          });
          cursored.continue();
        } else {
          // Update state with the newly fetched data
          setBox(newBox);
        }
      };
    };
    request.onerror = function () {
      console.error('Error opening/creating collections:', request.error);
    };
  }, []);



  indexedDB.close;

  const sortedItems = box.sort((a, b) => a.used - b.used);

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
            onDelete={deleteItem} 
          />
        ))}
      </div>
    </div>
  );
};

export default Collection;
