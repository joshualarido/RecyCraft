import { FaHammer } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";

const CraftBox = (props) => {
  return (
    <div className="card w-78 bg-base-100 shadow-xl p-4">
      <div className="rounded-lg overflow-hidden mb-2">
        <img
          src={props.image}
          alt={props.item}
          className="h-40 w-full object-cover rounded-lg"
        />
      </div>

      <div className="card-body p-1">
        <div className="flex justify-between items-start mb-1">
          <h2 className="card-title text-lg">{props.item}</h2>
          <button className="hover:text-blue-400">
            <FaBookmark className="text-lg transition-colors cursor-pointer" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">{props.description}</p>

        <button className="btn btn-ghost btn-sm w-full flex items-center justify-center gap-2 border mt-1 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition rounded-md">
          <FaHammer className="text-lg" />
          Craft
        </button>
      </div>
    </div>
  );
};

export default CraftBox;
