import CollectionBox from "../components/CollectionBox";

const Collection = () => {
  const items = [
    {
      item: "Bottle Planter 1",
      image: "https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg",
      description: "Size x Size",
      used: false,
    },
    {
      item: "Bottle Planter 2",
      image: "https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg",
      description: "Size x Size",
      used: false,
    },
    {
      item: "Bottle Planter 3",
      image: "https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg",
      description: "Size x Size",
      used: true,
    },
    {
      item: "Bottle Planter 4",
      image: "https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg",
      description: "Size x Size",
      used: true,
    },
    {
      item: "Bottle Planter 5",
      image: "https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg",
      description: "Size x Size",
      used: true,
    },
    {
      item: "Bottle Planter 6",
      image: "https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg",
      description: "Size x Size",
      used: false,
    },
    {
      item: "Bottle Planter 7",
      image: "https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg",
      description: "Size x Size",
      used: false,
    },
    {
      item: "Bottle Planter 8",
      image: "https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg",
      description: "Size x Size",
      used: false,
    },
  ];

  const sortedItems = items.sort((a, b) => a.used - b.used);

  return (
    <div>
      <p className="text-xl font-semibold mb-2">All items</p>
      <div className="grid grid-cols-4 gap-4">
        {sortedItems.map((item, index) => (
          <CollectionBox
            key={index}
            item={item.item}
            image={item.image}
            description={item.description}
            used={item.used}
          />
        ))}
      </div>
    </div>
  );
};

export default Collection;
