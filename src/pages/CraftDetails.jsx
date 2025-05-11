import BigProgressBar from "../components/BigProgressBar"
import CraftCard from "../components/CraftCard"
import chido from "../assets/react.svg"
import CraftImageCard from "../components/CraftImageCard"
import CraftStepCard from "../components/CraftStepCard"
import { useState } from 'react'



const Crafts = () => {
    const steps = [
        { title: "Mark the Cutting Line", description: "balalalalal\ne\ne" },
        { title: "Cut the Bottle", description: "c525325ut\ne\n" },
        { title: "Glue the Edges", description: "g244124ue\ne\n" }
    ]

    const [StepProgress, setStepProgress] = useState(0);
    const barProgress = Math.floor(StepProgress/steps.length*100);
    return (
        <>
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Craft Description</h1>
            <div className="flex gap-4">
                <CraftImageCard CraftImage={chido}/>
                <CraftCard CraftName={"hell2o"} CraftDescription={"oijfwe9jf842j8929j92033"} CraftUses={"osgjsdf989dsjsod"}/>
            </div>
            <div className="flex flex-col gap-4 w-full">
                <h2 className="text-xl flex items-center font-semibold">Instructions ({StepProgress}/{steps.length})</h2>
                <BigProgressBar progress={barProgress}/>
            </div>
            {steps.map((step, index) => (
                <CraftStepCard
                    key={index}
                    StepNumber={index + 1}
                    StepTitle={step.title}
                    StepDescription={step.description}
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