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

    const [StepProgress, setStepProgress] = useState(0);
    const barProgress = Math.floor(StepProgress/steps.length*100);
    return (
        <>
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Craft Description</h1>
            <div className="flex gap-4">
                <CraftImageCard CraftImage={chido}/>
                <CraftCard CraftName={craft.name} CraftDescription={craft.description} CraftUses={craft.description}/>
            </div>
            <div className="flex flex-col gap-4 w-full">
                <h2 className="text-xl flex items-center font-semibold">Instructions ({StepProgress}/{steps.length})</h2>
                <BigProgressBar progress={barProgress}/>
            </div>
            {steps.map((step, index) => (
                <CraftStepCard
                    key={index}
                    StepNumber={index + 1}
                    StepTitle=""
                    StepDescription={step}
                    isClicked={index < StepProgress}
                    onClick={() => {
                        if (index === StepProgress) {
                        setStepProgress((prev) => prev + 1);
                        }
                    }}
                    />
            ))}
        </div>
        </>
    );
}
 
export default Crafts;