"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import ColorView from "@/components/color-view";
import { CheckCircle2, XCircle } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string;
  createdAt: string;
  name: string;
  price: string;
  isFeatured: boolean;
  isArchived: boolean;
  category: string;
  size: string;
  color: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) =>
      row.original.isFeatured ? <CheckCircle2 /> : <XCircle />,
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
    cell: ({ row }) =>
      row.original.isArchived ? <CheckCircle2 /> : <XCircle />,
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => <ColorView hex={row.original.color} />,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
