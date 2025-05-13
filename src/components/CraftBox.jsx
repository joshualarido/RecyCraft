import { FaHammer } from "react-icons/fa6";
import { FaBookmark, FaRegBookmark  } from "react-icons/fa";

const CraftBox = (props) => {
  return (
    <div className="card w-full bg-base-100 shadow-lg p-4">
      <div className="rounded-lg overflow-hidden mb-2">
        <img
          src={props.image}
          alt={props.item}
          className="h-40 w-full object-cover rounded-lg max-sm:h-32"
        />
      </div>

      <div className="card-body p-1">
        <div className="flex justify-between items-center mb-1 max-sm:flex-col max-sm:gap-2">
          <h2 className="card-title text-lg">{props.item}</h2>
          <button className="hover:text-emerald-600">
            <FaRegBookmark className="text-lg transition-colors cursor-pointer" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4 max-sm:text-xs max-sm:mb-2">{props.description}</p>

        <button className="btn btn-ghost btn-sm w-full flex items-center justify-center gap-2 border mt-1 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition rounded-md
                          max-sm:text-sm">
          <FaHammer className="text-lg" />
          Craft
        </button>
      </div>
    </div>
  );
};

export default CraftBox;
