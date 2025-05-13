import { FaHammer } from "react-icons/fa6";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { initDB } from "../../db/indexedDB";
import { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import CraftDetails from "../pages/CraftDetails";
const CraftBox = (props) => {
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState(null); // store the assigned id from IndexedDB

  useEffect(() => {
    if (props.saved) setSaved(true);
  }, [props.saved]);

  const saveCraftToIndexedDB = async (itemName, itemDesc, itemSteps) => {
    const db = await initDB();
    const tx = db.transaction("crafts", "readwrite");
    const store = tx.objectStore("crafts");

    const craftData = { name: itemName, description: itemDesc, steps: itemSteps };
    const request = store.add(craftData); // let IndexedDB auto-generate the id

    request.onsuccess = (e) => {
      console.log("Saved to DB with id:", e.target.result);
      setSaved(true);
      setSavedId(e.target.result); // ✅ store the ID
    };
    request.onerror = (e) => console.error("Save error", e);
  };

  const removeCraftFromIndexedDB = async () => {
    if (savedId == null) {
      console.warn("Cannot delete: No saved ID found");
      return;
    }

    const db = await initDB();
    const tx = db.transaction("crafts", "readwrite");
    const store = tx.objectStore("crafts");

    const request = store.delete(savedId);

    request.onsuccess = () => {
      console.log("Removed from DB");
      setSaved(false);
      setSavedId(null);
    };
    request.onerror = (e) => console.error("Delete error", e);
  };

  const toggleSave = () => {
    if (saved) {
      removeCraftFromIndexedDB(); // now we have correct ID
    } else {
      saveCraftToIndexedDB(props.item, props.description, props.steps);
    }
  };

  return (
    <div className="card w-full bg-base-100 shadow-lg p-4">
      <div className="rounded-lg overflow-hidden mb-2">
        <img
          src={props.image}
          alt={props.item}
          className="h-40 w-full object-cover rounded-lg max-sm:h-32"
        />
      </div>

      <div className="card-body p-1">
        <div className="flex justify-between items-start mb-1 max-sm:flex-col max-sm:gap-2">
          <h2 className="card-title text-lg">{props.item}</h2>
          <h1
            className="text-lg transition-colors cursor-pointer pt-2 hover:text-emerald-600"
            onClick={toggleSave}
          >
            {saved ? <FaBookmark className="text-emerald-600" /> : <FaRegBookmark />}
          </h1>
        </div>

        <p className="text-sm text-gray-600 mb-4 max-sm:text-xs max-sm:mb-2">{props.description}</p>

        <Link to={"/craftdetails"} 
                  state={{ craft: {
                    name: props.item,
                    description: props.description,
                    steps: props.steps,
                    image: props.image
                  } }}
        className="btn btn-ghost btn-sm w-full flex items-center justify-center gap-2 border mt-1 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition rounded-md
                          max-sm:text-sm">
          <FaHammer className="text-lg" />
          Craft
        </Link>
      </div>
    </div>
  );
};

export default CraftBox;
