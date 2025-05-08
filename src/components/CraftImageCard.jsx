const CraftImageCard = ({CraftImage}) => {
   return (
       <>
           <div className="rounded-xl h-80 w-1/3 bg-white shadow-lg">
               <img src={CraftImage} className="h-full w-full rounded-xl object-cover"></img>
           </div>
       </>
   );
 }

export default CraftImageCard;