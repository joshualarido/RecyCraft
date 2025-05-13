import ProgressBox from "../components/ProgressBox";
import CraftBox from "../components/CraftBox";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { initDB } from "../../db/indexedDB";

const Crafts = () => {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [crafts, setCrafts] = useState([]);
  const [suggestedCrafts, setSuggestedCrafts] = useState([]);
  const sampleImage = "https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg";

  const addSampleCraftToIndexedDB = async () => {
    try {
      const db = await initDB();
      const tx = db.transaction("crafts", "readwrite");
      const store = tx.objectStore("crafts");

      await store.put({
        id: 1, // Ensure ID is added if needed for deletion
        title: "Sample Craft",
        image: sampleImage,
        materials: "Plastic bottle, soil, plant",
        steps: "1. Cut bottle\n2. Add soil\n3. Plant seeds",
        description: "A bottle reused as a planter",
        progress: 20,
      });

      await tx.complete;
      console.log("Sample craft added successfully");
    } catch (error) {
      console.error("Failed to add craft:", error);
    }
  };

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

      request.onsuccess = async (event) => {
        const cursor = event.target.result;
        if (cursor) {
          craftsArray.push(cursor.value);
          cursor.continue();
        } else {
          setCrafts(craftsArray);

          // Send 2 random items to Gemini
          if (craftsArray.length >= 2) {
            const selected = craftsArray
              .sort(() => 0.5 - Math.random())
              .slice(0, 2);
            await createSuggestion(selected);
          }
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
        setCrafts((prev) => prev.filter((c) => c.id !== id));
      };

      tx.onerror = (e) => console.error("Delete error", e);
    } catch (error) {
      console.error("IndexedDB delete error:", error);
    }
  };

  const createSuggestion = async (items) => {
    const formattedItems = items
      .map(
        (item, idx) => `Item ${idx + 1}:
Title: ${item.title}
Description: ${item.description}`
      )
      .join("\n\n");

    const prompt = `
You are given two recycled crafts with titles and descriptions. Based on these, suggest four new craft ideas made by creatively combining their themes, purposes, or materials.

Here are the items:
${formattedItems}

Return the suggestions strictly in this JSON format. Do not include any explanation or extra text.

{
  "crafts": [
    {
      "name": "string",
      "description": "string",
      "steps": [
        "string",
        "string",
        "string",
        "string"
      ]
    },
    {
      "name": "string",
      "description": "string",
      "steps": [
        "string",
        "string",
        "string",
        "string"
      ]
    },
    {
      "name": "string",
      "description": "string",
      "steps": [
        "string",
        "string",
        "string",
        "string"
      ]
    },
    {
      "name": "string",
      "description": "string",
      "steps": [
        "string",
        "string",
        "string",
        "string"
      ]
    }
  ]
}
  Do NOT use triple backticks or any Markdown formatting.
  It must be reiterated that the start of the output should NOT start with \\\JSON or end with \\\ either.
`;

    try {
      const res = await axios.post("/gemini/text", { prompt });
      const reply = res.data.reply.text;

      try {
        const parsed = JSON.parse(reply);
        setSuggestedCrafts(parsed.crafts);
        console.log("Gemini Suggestions:", parsed.crafts);
      } catch (jsonError) {
        console.error("Failed to parse Gemini reply as JSON:", jsonError);
        console.log("Raw reply from Gemini:", reply);
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
    }
  };

  useEffect(() => {
    const load = async () => {
      await addSampleCraftToIndexedDB();
      await loadCraftsFromIndexedDB();
    };
    load();
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
          {suggestedCrafts.map((craft, index) => (
            <CraftBox
              key={index}
              name={craft.name}
              description={craft.description}
              steps={craft.steps}
              image={sampleImage} // Or generatedImage if needed
              saved={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Crafts;