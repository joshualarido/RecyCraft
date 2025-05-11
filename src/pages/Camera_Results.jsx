import image from '../assets/photoedTrash.jpg'
import CraftBox from '../components/CraftBox';

const Camera_Results = () => {
    return (
        <>
        <h1 className="text-2xl font-bold py-2">Item Description</h1>
        <div className="flex items-center gap-4 min-h-[150px]">
  <img src="https://s3.eu-1.blufs.ir/aradbranding-en-wp-content/uploads/2022/09/3.1_11zon-45.jpg" alt="Picture recently taken" className="card h-150 bg-base-100 shadow-xl" />
  <div className="text-xl text-gray-800 bg-white rounded-lg p-4 shadow-md inline-block min-h-[150px] py-10">
    <p className="py-3"><strong>Item</strong>: Plastic Bag</p>
    <p className="py-3"><strong>Description</strong>: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus. Curabitur sed tortor mi. Aenean auctor imperdiet sapien.</p>
    <p className="py-3"><strong>Recyclability</strong>: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus. Curabitur sed tortor mi. Aenean auctor imperdiet sapien, a accumsan eros pharetra tempor. Etiam viverra metus ac elit malesuada, et volutpat orci elementum. Nam nec sapien eget mi tempor iaculis eu in leo. Nam cursus tristique enim, id molestie tortor sagittis a.</p>
  </div>
</div>


            <h1 className="text-2xl font-bold py-10">Simple Recycle Suggestions</h1>
            <div className="flex justify-start gap-8">
                <div><CraftBox 
                item="Bottle Planter 5"
                image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/></div>
                <div><CraftBox 
                item="Bottle Planter 5"
                image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/></div>
                <div><CraftBox 
                item="Bottle Planter 5"
                image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/></div>
                <div><CraftBox 
                item="Bottle Planter 5"
                image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/></div>
            </div>
            <h1 className="text-2xl font-bold py-10">Multifaceted Recycle Suggestions</h1>
            <div className="flex justify-start gap-8">
            <div><CraftBox 
                item="Bottle Planter 5"
                image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/></div>
                <div><CraftBox 
                item="Bottle Planter 5"
                image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/></div>
                <div><CraftBox 
                item="Bottle Planter 5"
                image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/></div>
                <div><CraftBox 
                item="Bottle Planter 5"
                image="https://m.media-amazon.com/images/I/A1usmJwqcOL.jpg"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at semper turpis, tempor egestas metus."/></div>
            </div>
        
        </>
    );
}

export default Camera_Results;