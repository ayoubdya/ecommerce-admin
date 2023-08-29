import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import BillboardClient from "./components/client";
import { BillboardColumn } from "./components/columns";

const BillboardPage = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = params;

  const billboards = await prismadb.billboard.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map(
    ({ id, label, createdAt, imageUrl }) => ({
      id,
      label,
      imageUrl,
      createdAt: format(createdAt, "dd MMMM yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardPage;
