import ProgressBox from "../components/ProgressBox";
import CraftBox from "../components/CraftBox";

const Crafts = () => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">In Progress</h1>
          <div className="grid grid-cols-4 gap-4">
            <ProgressBox
              item="Bottle Planter 1"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              progress="47"
            />
            <ProgressBox
              item="Bottle Planter 2"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              progress="98"
            />
            <ProgressBox
              item="Bottle Planter 3"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              progress="12"
            />
            <ProgressBox
              item="Bottle Planter 4"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              progress="82"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">Other Possible Crafts</h1>
          <div className="grid grid-cols-4 gap-4">
            <CraftBox
              item="Bottle Planter 5"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."
            />
            <CraftBox
              item="Bottle Planter 6"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."
            />
            <CraftBox
              item="Bottle Planter 7"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Crafts;
