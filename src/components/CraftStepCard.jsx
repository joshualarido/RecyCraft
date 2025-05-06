const CraftStepCard = ({StepNumber, StepTitle, StepDescription}) => {
  return (
      <>
        <div className="w-full min-h-36 rounded-xl bg-white shadow-xl flex flex-col px-6 py-4">
            <div className="font-bold flex items-center gap-2">
                Step {StepNumber}:  {StepTitle}
                <input type="checkbox" className="checkbox checkbox-success" />
            </div>
            <div>
              <p className="whitespace-pre-line">
              {StepDescription}
              </p>
            </div>
            
        </div>
      </>
  );
}

export default CraftStepCard;