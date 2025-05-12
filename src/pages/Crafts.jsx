import ProgressBox from "../components/ProgressBox";
import CraftBox from "../components/CraftBox";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Crafts = () => {
  const [generatedImage, setGeneratedImage] = useState(null);

  const callGemini = async (prompt) => {
    try {
      const res = await axios.post("/gemini", { prompt });

      const reply = res.data.reply;

      console.log("Gemini reply:", reply);
      const imageUrl = `data:${reply.mimeType};base64,${reply.image}`;
      setGeneratedImage(imageUrl);
      
    } catch (error) {
      console.error("Error calling Gemini API:", error);
    }
  };

  useEffect(() => {
    // callGemini(
    //   "Create a photorealistic image of a recycled plastic water bottle that has been cut and reused as a soil planter. Include soil and a small green plant. Make it look like a DIY craft. Respond only with an image and text, provide a small desciption along with the response."
    // );
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">In Progress</h1>
          <div className="grid grid-cols-4 gap-4">
            <ProgressBox
              item="Bottle Planter 1"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              progress="47"
            />
            <ProgressBox
              item="Bottle Planter 2"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              progress="98"
            />
            <ProgressBox
              item="Bottle Planter 3"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              progress="12"
            />
            <ProgressBox
              item="Bottle Planter 4"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              progress="82"
            />
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
    </>
  );
};

export default Crafts;
