const CraftCard = ({CraftName, CraftDescription, CraftUses}) => {
  return (
      <>
        <div className="rounded-xl h-80 w-2/3 bg-white shadow-lg flex flex-col p-8 gap-7">
        <div>
              <div className="flex items-center gap-4 text-xl">
                  <div className="font-bold">
                      Name:
                   </div>
                      {CraftName}
                   </div>
                  <div>
                      {CraftDescription}
                   </div>
              </div>
           <div>
              <div className="font-bold">
                      Uses:
              </div>
                  {CraftUses}
           </div>
        </div>
      </>
  );
}

export default CraftCard;