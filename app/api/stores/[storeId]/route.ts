import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { name } = await req.json();
    if (!name) return new NextResponse("Missing name", { status: 400 });
    const { storeId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    const patchedStore = await prismadb.store.update({
      where: { id: storeId, userId },
      data: { name },
    });
    return NextResponse.json(patchedStore);
  } catch (err) {
    console.log("STORES_STOREID_PATCH", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  _req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { storeId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    const deletedStore = await prismadb.store.delete({
      where: {
        id: storeId,
        userId,
      },
    });
    return NextResponse.json(deletedStore);
  } catch (err) {
    console.log("STORES_STOREID_DELETE", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
