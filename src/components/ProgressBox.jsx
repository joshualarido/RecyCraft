import { IoSearch } from "react-icons/io5";
import { FaRegTrashCan } from "react-icons/fa6";

const ProgressBox = (props) => {
  return (
    <div className="card w-full bg-base-100 shadow-lg p-4">
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
          <button className="hover:text-red-600">
            <FaRegTrashCan className="text-lg transition-colors cursor-pointer"/>
          </button>
        </div>

        <button className="btn btn-ghost btn-sm w-full flex items-center justify-center gap-2 border mt-1 bg-emerald-100 text-emerald-600">
          <IoSearch className="text-lg" />
          View
        </button>

        <div className="flex items-center gap-2 mt-3">
          <p className="text-sm text-gray-500 whitespace-nowrap">Progress</p>
          <progress
            className="progress progress-success flex-grow"
            value={props.progress}
            max="100"
          ></progress>
          <p className="text-sm text-gray-700 whitespace-nowrap">
            {props.progress}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressBox;
