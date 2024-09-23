import { Button } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";
import ProductCardSection from "~/component/product/ProductCard";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix & Mantine UI" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

console.log("Hello, Remix with Mantine!");

export default function Index() {
  return (
    <div className="flex h-screen justify-center">
      <div className="w-3/5 p-10 grid grid-cols-3 justify-center">
        <ProductCardSection />
      </div>
      <div className="2/5 border"></div>
    </div>
  );
}
