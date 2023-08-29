"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
// import type { Billboard } from "@prisma/client";
// import Image from "next/image";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { APIList } from "@/components/api-list";

interface BillboardClientProps {
  data: BillboardColumn[];
}

const BillboardClient: React.FC<BillboardClientProps> = ({ data = [] }) => {
  const router = useRouter();
  const { storeId } = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage billboards for your store"
        />
        <Button onClick={() => router.push(`/${storeId}/billboards/new`)}>
          <Plus className="mr-2 w-4 h-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} />
      <Separator />
      <Heading title="API" description="API calls for billboards" />
      <APIList entityName="billboards" entityIdName="billboardId" />
      {/* <div className="grid grid-cols-4">
        {data.map(({ id, imageUrl }) => (
          <div
            key={id}
            className="relative overflow-hidden w-[400px] h-[200px] rounded-md hover:shadow-2xl transition-shadow hover:cursor-pointer"
          >
            <Image
              alt="billboard image"
              src={imageUrl}
              fill
              className="object-cover"
              onClick={() => router.push(`/${storeId}/billboards/${id}`)}
            />
          </div>
        ))}
      </div> */}
    </>
  );
};

export default BillboardClient;
