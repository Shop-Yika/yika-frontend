import { getInventory } from "@/lib/api/inventory";

// This is the main page for the shop section of the app. It will display the shop experience heading and the shop section.

// it will also fetch inventory data before using other components
import ShopExpHeading from "@/components/shop/ShopExpHeading";
import ShopSection from "@/components/shop/ShopSection";

export default async function Home() {
  const products = await getInventory();

    return (
      <div>

          {/* Only show on small screens and up */}
          <div className="hidden sm:block">
              <ShopExpHeading />
          </div>

          <ShopSection products={products} />
      </div>
  );
}
