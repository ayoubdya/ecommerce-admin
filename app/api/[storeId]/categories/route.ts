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
    const { name, billboardId } = await req.json();
    if (!name) return new NextResponse("Missing name", { status: 400 });
    if (!billboardId)
      return new NextResponse("Missing billboardId", { status: 400 });
    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId,
      },
    });
    return NextResponse.json(category);
  } catch (err) {
    console.log("[STOREID_CATEGORIES_POST]", err);
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
    const categories = await prismadb.store
      .findUnique({
        where: {
          id: storeId,
          // userId,
        },
      })
      .categories();
    return NextResponse.json(categories);
  } catch (err) {
    console.log("[STOREID_CATEGORIES_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
