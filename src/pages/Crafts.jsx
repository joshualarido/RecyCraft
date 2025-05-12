import ProgressBox from "../components/ProgressBox";
import CraftBox from "../components/CraftBox";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { initDB } from "../../db/indexedDB";

const Crafts = () => {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [crafts, setCrafts] = useState([]);
  const sampleImage = "https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg";

  const addSampleCraftToIndexedDB = async () => {
    try {
      const db = await initDB();
      const tx = db.transaction("crafts", "readwrite");
      const store = tx.objectStore("crafts");

      await store.put({
        title: "Sample Craft",
        image: sampleImage,
        materials: "Plastic bottle, soil, plant",
        steps: "1. Cut bottle\n2. Add soil\n3. Plant seeds",
        description: "A bottle reused as a planter",
        progress: 20,
      });

      await tx.complete; // Wait for transaction to finish
      console.log("Sample craft added successfully");
    } catch (error) {
      console.error("Failed to add craft:", error);
    }
  };

  //To Gemini
  const callGemini = async (prompt) => {
    try {
      const res = await axios.post("/gemini", { prompt });
      const reply = res.data.reply;

      const imageUrl = `data:${reply.mimeType};base64,${reply.image}`;
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
    }
  };

  const loadCraftsFromIndexedDB = async () => {
    try {
      const db = await initDB();
      const tx = db.transaction("crafts", "readonly");
      const store = tx.objectStore("crafts");

      const craftsArray = [];

      const request = store.openCursor();
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          craftsArray.push(cursor.value);
          cursor.continue();
        } else {
          setCrafts(craftsArray);
        }
      };

      request.onerror = (e) => {
        console.error("Error loading crafts:", e);
      };
    } catch (err) {
      console.error("IndexedDB error:", err);
    }
  };

  const handleDeleteCraft = async (id) => {
    try {
      const db = await initDB();
      const tx = db.transaction("crafts", "readwrite");
      const store = tx.objectStore("crafts");

      await store.delete(id);

      tx.oncomplete = () => {
        console.log(`Craft with id ${id} deleted`);
        setCrafts((prev) => prev.filter((c) => c.id !== id)); // Update UI
      };

      tx.onerror = (e) => console.error("Delete error", e);
    } catch (error) {
      console.error("IndexedDB delete error:", error);
    }
  };

  useEffect(() => {

    const load = async() => {
      await addSampleCraftToIndexedDB();
      await loadCraftsFromIndexedDB();
    }
    load()
    // callGemini("Prompt for Gemini AI...");
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">In Progress</h1>
        <div className="grid grid-cols-4 gap-4">
          {crafts.map((craft) => (
            <ProgressBox
              key={craft.id}
              id={craft.id}
              item={craft.title}
              image={craft.image}
              progress={craft.progress}
              onDelete={handleDeleteCraft}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Other Possible Crafts</h1>
        <div className="grid grid-cols-4 gap-4">
          {generatedImage && (
            <CraftBox
              item="AI-Generated Bottle Planter"
              image={generatedImage}
              description="This image was generated using Google Gemini AI."
            />
          )}

          <CraftBox
            item="Bottle Planter 6"
            image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."
          />
          <CraftBox
            item="Bottle Planter 7"
            image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."
          />
        </div>
      </div>
    </div>
  );
};

export default Crafts;
