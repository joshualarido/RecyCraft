import { FaRegTrashCan } from "react-icons/fa6";

const CollectionBox = (props) => {
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
            <FaRegTrashCan className="text-lg transition-colors cursor-pointer" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">{props.description}</p>
      </div>

      {props.used ? (
        <p className="text-sm font-medium text-red-400 bg-red-100 px-3 py-1 rounded-full w-fit">
          Being Used
        </p>
      ) : (
        <p className="text-sm font-medium text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full w-fit">
          Not Used
        </p>
      )}
    </div>
  );
};

export default CollectionBox;
