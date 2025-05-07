

const CraftStepCard = ({StepNumber, StepTitle, StepDescription, isClicked, onClick}) => {
    
  return(
        <>
        <div onClick={onClick} 
             className={`w-full min-h-36 rounded-xl shadow-xl flex flex-col px-6 py-4 transition-colors duration-300
                         ${isClicked ? 'bg-green-200' : 'bg-white'}`}>
          

            <div className="font-bold flex items-center">
                Step {StepNumber}:  {StepTitle}
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