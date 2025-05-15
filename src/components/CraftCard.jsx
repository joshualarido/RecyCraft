const CraftCard = ({CraftName, CraftDescription, CraftUses}) => {
  return (
      <>
        <div className="rounded-xl h-fit w-3/4 bg-white shadow-lg flex flex-col p-6 gap-4">
            <div>
               <h2 className="text-lg font-bold">{CraftName}</h2>
            </div>
            <div>
               <p className="text-md">{CraftDescription}</p>
            </div>
        </div>
      </>
  );
}

export default CraftCard;