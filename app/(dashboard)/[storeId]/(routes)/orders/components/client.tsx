"use client";

import Heading from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { APIList } from "@/components/api-list";

interface OrdertProps {
  data: OrderColumn[];
}

const OrderClient: React.FC<OrdertProps> = ({ data = [] }) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />
      <Separator />
      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  );
};

export default OrderClient;
