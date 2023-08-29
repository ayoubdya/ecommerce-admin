import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { storeId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    const store = await prismadb.store.findUnique({
      where: { id: storeId, userId },
    });
    if (!store) return new NextResponse("Store not found", { status: 404 });
    const { name, value } = await req.json();
    if (!name) return new NextResponse("Missing name", { status: 400 });
    if (!value) return new NextResponse("Missing value", { status: 400 });
    const size = await prismadb.size.create({
      data: {
        name,
        value,
        storeId,
      },
    });
    return NextResponse.json(size);
  } catch (err) {
    console.log("[STOREID_SIZES_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  _req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    // const { userId } = auth();
    // if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { storeId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    const sizes = await prismadb.store
      .findUnique({
        where: {
          id: storeId,
          // userId,
        },
      })
      .Size();
    return NextResponse.json(sizes);
  } catch (err) {
    console.log("[STOREID_SIZES_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
