import ProgressBox from "../components/ProgressBox";
import CraftBox from "../components/CraftBox";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { initDB } from "../../db/indexedDB";

const Crafts = () => {
  const [generatedImage, setGeneratedImage] = useState(null);
  const [crafts, setCrafts] = useState([]);
  const [suggestedCrafts, setSuggestedCrafts] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const sampleImage = "https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg";

  //Remove (addSampleCraftToIndexedDB + addSampleCollectionsToIndexedDB) after everything finishes
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

  const addSampleCollectionsToIndexedDB = async () => {
    try {
      const db = await initDB();
      const tx = db.transaction("collections", "readwrite");
      const store = tx.objectStore("collections");

      const sampleCollections = [
        {
          name: "Bottle Bird Feeder",
          image: "https://example.com/bottle-bird.jpg",
          description:
            "A bird feeder made from a plastic bottle and wooden spoons.",
          used: false,
        },
        {
          name: "Can Lantern",
          image: "https://example.com/can-lantern.jpg",
          description: "A lantern made by punching holes in recycled cans.",
          used: false,
        },
        {
          name: "Cardboard Organizer",
          image: "https://example.com/cardboard-organizer.jpg",
          description: "A desk organizer crafted from old cardboard boxes.",
          used: false,
        },
        {
          name: "CD Mosaic Art",
          image: "https://example.com/cd-mosaic.jpg",
          description: "A mosaic artwork created from broken CD pieces.",
          used: false,
        },
        {
          name: "Jar Herb Garden",
          image: "https://example.com/jar-herb.jpg",
          description: "Mason jars reused for planting kitchen herbs.",
          used: false,
        },
      ];

      for (const item of sampleCollections) {
        await store.put(item);
      }

      await tx.complete;
      console.log("Sample collections added successfully.");
    } catch (error) {
      console.error("Failed to add sample collections:", error);
    }
  };

  //Handle delete button on progressBox
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

  //Handle save button on craftBox
  const handleSaveCraft = (newCraft) => {
    setCrafts((prev) => [...prev, newCraft]);
  };

  //Retrieve craft data from IDB
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
        }
      };

      request.onerror = (e) => {
        console.error("Error loading crafts:", e);
      };
    } catch (err) {
      console.error("IndexedDB error:", err);
    }
  };

  //Retrieve Collections from idb 
  const loadCollectionsFromIndexedDB = async () => {
    try {
      const db = await initDB();
      const tx = db.transaction("collections", "readonly");
      const store = tx.objectStore("collections");

      const collectionsArray = [];
      const request = store.openCursor();

      request.onsuccess = async (event) => {
        const cursor = event.target.result;
        if (cursor) {
          collectionsArray.push(cursor.value);
          cursor.continue();
        } else {
          if (collectionsArray.length >= 2) {
            await createSuggestions(collectionsArray);
          }
        }
      };

      request.onerror = (e) => {
        console.error("Error loading collections:", e);
      };
    } catch (err) {
      console.error("IndexedDB error:", err);
    }
  };

    //Generate Text + Image
    const createSuggestions = async (collections) => {
    setSuggestedCrafts([]); // clear previous
    setLoadingSuggestions(true); // show loading state

    for (let i = 0; i < 4; i++) {
      const formattedItems = collections
        .map(
          (item, idx) =>
            `Item ${idx + 1}:\nName: ${item.name}\nDescription: ${item.description}`
        )
        .join("\n\n");

      const prompt = `
        You are given a list of recycled crafts with their names and descriptions. Use inspiration from at least two of them to suggest **one** new craft idea.

        Respond strictly in this JSON format:
        {
          "craft": {
            "name": "string",
            "description": "string",
            "steps": ["string", "string", "string", "string"]
          }
        }

        Do NOT use triple backticks or any Markdown formatting.
        It must be reiterated that the start of the output should NOT start with \`\`\`JSON or end with \`\`\` either.

        Here are the crafts:
        ${formattedItems}
      `;

      try {
        const res = await axios.post("/gemini/text", { prompt });
        const reply = res.data.reply.text.trim();
        const parsed = JSON.parse(reply);
        const craft = parsed.craft;

        // Generate image
        const imagePrompt = `Generate an image for a recycled craft project called "${craft.name}". It is described as: ${craft.description}`;
        try {
          const imageRes = await axios.post("/gemini/image", { prompt: imagePrompt });
          const imageReply = imageRes.data.reply;
          craft.image = `data:${imageReply.mimeType};base64,${imageReply.image}`;
        } catch {
          craft.image = sampleImage;
        }

        // Render each immediately
        setSuggestedCrafts((prev) => [...prev, craft]);

      } catch (error) {
        console.error("Failed to generate suggestion:", error);
      }
    }

    setLoadingSuggestions(false); // all done
  };



  useEffect(() => {
    const load = async () => {
      //Remove this 2
      /* await addSampleCraftToIndexedDB();
      await addSampleCollectionsToIndexedDB(); */

      await loadCraftsFromIndexedDB();
      await loadCollectionsFromIndexedDB();
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
          {loadingSuggestions && suggestedCrafts.length === 0 ? (
            <p className="text-lg col-span-4">Loading...</p>
          ) : (
            suggestedCrafts.map((craft, index) => (
              <CraftBox
                key={index}
                item={craft.name}
                description={craft.description}
                steps={craft.steps}
                image={craft.image || sampleImage}
                saved={false}
                onSave={handleSaveCraft}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Crafts;
