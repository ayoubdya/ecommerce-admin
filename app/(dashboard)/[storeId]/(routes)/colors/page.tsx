import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import ColorClient from "./components/client";
import { ColorColumn } from "./components/columns";

const ColorPage = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = params;

  const colors = await prismadb.color.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });

  const formattedColors: ColorColumn[] = colors.map(
    ({ id, name, value, createdAt }) => ({
      id,
      name,
      value,
      createdAt: format(createdAt, "dd MMMM yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorPage;
