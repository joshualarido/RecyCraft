import BigProgressBar from "../components/BigProgressBar"
import CraftCard from "../components/CraftCard"
import chido from "../assets/react.svg"
import CraftImageCard from "../components/CraftImageCard"
import CraftStepCard from "../components/CraftStepCard"
import { useState } from 'react'
import { useLocation } from "react-router-dom";



const Crafts = () => {
    const location = useLocation();
    const craft  = location.state?.craft;
    const steps = craft?.steps;

    const [clickedSteps, setClickedSteps] = useState(() =>
  steps ? steps.map(() => false) : []
);
const handleStepClick = (index) => {
  const updated = [...clickedSteps];
  updated[index] = !updated[index];
  setClickedSteps(updated);
};

const StepProgress = clickedSteps.filter(Boolean).length;
    const barProgress = Math.floor(StepProgress / steps.length * 100);

    
    return (
        <>
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Craft Details</h1>
            <div className="flex flex-row gap-4">
                <CraftImageCard CraftImage={craft.image}/>
                <CraftCard CraftName={craft.name} CraftDescription={craft.description} CraftUses={craft.description}/>
            </div>
            <div className="flex flex-col gap-4 w-full">
                <h1 className="text-2xl flex items-center font-semibold">Instructions ({StepProgress}/{steps.length})</h1>
                <BigProgressBar progress={barProgress}/>
            </div>
            {steps.map((step, index) => (
                <CraftStepCard
                    key={index}
                    StepNumber={index + 1}
                    StepTitle=""
                    StepDescription={step}
                    isClicked={clickedSteps[index]}
                    onClick={() => handleStepClick(index)}
                    />
            ))}
        </div>
        </>
    );
}
 
export default Crafts;