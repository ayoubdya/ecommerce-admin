import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import CategoryClient from "./components/client";
import { CategoryColumn } from "./components/columns";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = params;

  const categories = await prismadb.category.findMany({
    where: { storeId },
    include: { billboard: true },
    orderBy: { createdAt: "desc" },
  });

  const formattedCategories: CategoryColumn[] = categories.map(
    ({ id, createdAt, name, billboard }) => ({
      id,
      name,
      billboardLabel: billboard.label,
      createdAt: format(createdAt, "dd MMMM yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
