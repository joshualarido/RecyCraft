import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { initDB } from "../../db/indexedDB";
import CraftImageCard from "../components/CraftImageCard";
import CraftCard from "../components/CraftCard";
import CraftStepCard from "../components/CraftStepCard";
import BigProgressBar from "../components/BigProgressBar";

const ViewDetails = () => {
  const { id } = useParams();
  const [craft, setCraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stepProgress, setStepProgress] = useState(0);

  useEffect(() => {
    const fetchCraft = async () => {
      try {
        const db = await initDB();
        const tx = db.transaction("crafts", "readonly");
        const store = tx.objectStore("crafts");
        const request = store.get(Number(id));

        request.onsuccess = () => {
          setCraft(request.result);
          setLoading(false);
        };

        request.onerror = (e) => {
          console.error("Failed to get craft:", e);
          setLoading(false);
        };
      } catch (error) {
        console.error("IndexedDB error:", error);
        setLoading(false);
      }
    };

    fetchCraft();
  }, [id]);

  if (loading) return <p className="text-center">Loading craft...</p>;
  if (!craft) return <p className="text-center">Craft not found.</p>;

  //Some of the datas are array and some step by step
  const steps = Array.isArray(craft.steps)
  ? craft.steps
  : typeof craft.steps === "string"
  ? craft.steps.split("\n")
  : [];

  const barProgress = Math.floor((stepProgress / steps.length) * 100);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Craft Description</h1>
      <div className="flex gap-4">
        <CraftImageCard CraftImage={craft.image} />
        <CraftCard
          CraftName={craft.title}
          CraftDescription={craft.description}
          CraftUses={craft.materials}
        />
      </div>
      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-xl flex items-center font-semibold">
          Instructions ({stepProgress}/{steps.length})
        </h2>
        <BigProgressBar progress={barProgress} />
      </div>
      {steps.map((step, index) => (
        <CraftStepCard
          key={index}
          StepNumber={index + 1}
          StepTitle=""
          StepDescription={step}
          isClicked={index < stepProgress}
          onClick={() => {
            if (index === stepProgress) {
              setStepProgress((prev) => prev + 1);
            }
          }}
        />
      ))}
    </div>
  );
};

export default ViewDetails;
