"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
// import type { Billboard } from "@prisma/client";
// import Image from "next/image";

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ColorColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { APIList } from "@/components/api-list";

interface ColorClientProps {
  data: ColorColumn[];
}

const ColorClient: React.FC<ColorClientProps> = ({ data = [] }) => {
  const router = useRouter();
  const { storeId } = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${data.length})`}
          description="Manage colors for your store"
        />
        <Button onClick={() => router.push(`/${storeId}/colors/new`)}>
          <Plus className="mr-2 w-4 h-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Separator />
      <Heading title="API" description="API calls for colors" />
      <APIList entityName="colors" entityIdName="colorId" />
    </>
  );
};

export default ColorClient;
