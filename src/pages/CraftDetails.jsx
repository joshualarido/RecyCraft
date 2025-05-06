import BigProgressBar from "../components/BigProgressBar"
import CraftCard from "../components/CraftCard"
import chido from "../assets/chido.PNG"
import CraftImageCard from "../components/CraftImageCard"
import CraftStepCard from "../components/CraftStepCard"

const CraftDetails = () => {

    return (
        <>
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Craft Description</h1>
        <div className="flex gap-4">
            <CraftImageCard CraftImage={chido}/>
            <CraftCard CraftName={"hell2o"} CraftDescription={"oijfwe9jf842j8929j92033"} CraftUses={"osgjsdf989dsjsod"}/>
        </div>
        <div className="flex flex-col gap-2">
        <h1 className="text-xl">Instructions</h1>
        <BigProgressBar progress={20}/>
        </div>
        <CraftStepCard StepNumber={1} StepTitle={"Mark the Cutting Line"} StepDescription={"balalalalal\ne\ne"}/>
        <CraftStepCard StepNumber={1} StepTitle={"Mark the Cutting Line"} StepDescription={"balalalalal\ne\ne\ne\ne\ne"}/>
        <CraftStepCard StepNumber={1} StepTitle={"Mark the Cutting Line"} StepDescription={"balalalalal\ne\ne"}/>
        <CraftStepCard StepNumber={1} StepTitle={"Mark the Cutting Line"} StepDescription={"balalalalal\ne\ne"}/>
        <CraftStepCard StepNumber={1} StepTitle={"Mark the Cutting Line"} StepDescription={"balalalalal\ne\ne"}/>
        </div>
        </>
    );
}
 
export default CraftDetails;