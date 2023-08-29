import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
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
    const { label, imageUrl } = await req.json();
    if (!label) return new NextResponse("Missing label", { status: 400 });
    if (!imageUrl) return new NextResponse("Missing imageUrl", { status: 400 });
    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId,
      },
    });
    return NextResponse.json(billboard);
  } catch (err) {
    console.log("[STOREID_BILLBOARDS_POST]", err);
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
    const billboards = await prismadb.store
      .findUnique({
        where: {
          id: storeId,
          // userId,
        },
      })
      .billboards();
    return NextResponse.json(billboards);
  } catch (err) {
    console.log("[STOREID_BILLBOARDS_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
