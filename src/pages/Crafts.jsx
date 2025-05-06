import Box from "../components/Box";
import { FaRegTrashCan } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";

const Crafts = () => {
  return (
    <>
      <div className="p-4 space-y-6">
        <div>
          <p className="text-xl font-semibold mb-2">In Progress</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Box
              item="Bottle Planter"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              progress="47"
              icon={FaRegTrashCan}
            />
            <Box
              item="Bottle Planter"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              progress="47"
              icon={FaRegTrashCan}
            />
            <Box
              item="Bottle Planter"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              progress="47"
              icon={FaRegTrashCan}
            />
          </div>
        </div>

        <div>
          <p className="text-xl font-semibold mb-2">Other possible crafts</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Box
              item="Bottle Planter"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              progress="0"
              icon={FaBookmark}
            />
            <Box
              item="Bottle Planter"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              progress="0"
              icon={FaBookmark}
            />
            <Box
              item="Bottle Planter"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              progress="0"
              icon={FaBookmark}
            />
            <Box
              item="Bottle Planter"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              progress="0"
              icon={FaBookmark}
            />
            <Box
              item="Bottle Planter"
              image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
              progress="0"
              icon={FaBookmark}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Crafts;
