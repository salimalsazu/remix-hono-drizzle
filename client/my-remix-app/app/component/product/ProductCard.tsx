import { Button } from "@mantine/core";

const ProductCardSection = () => {
  const product = {
    title: "Product Title",
    description: "Product Description",
    price: 100,
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white h-48">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{product.title}</div>
        <p className="text-gray-700 text-base">{product.description}</p>
      </div>
      <div className="px-6 py-4 flex justify-between items-center">
        <span className="text-2xl font-semibold">${product.price}</span>
        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCardSection;
