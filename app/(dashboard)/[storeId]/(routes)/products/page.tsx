import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";

import ProductClient from "./components/client";
import { ProductColumn } from "./components/columns";

const ProductPage = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = params;

  const products = await prismadb.product.findMany({
    where: { storeId },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: formatter.format(product.price.toNumber()),
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    category: product.category.name,
    size: product.size.value,
    color: product.color.value,
    createdAt: format(product.createdAt, "dd MMMM yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductPage;
