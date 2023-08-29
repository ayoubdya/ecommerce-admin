import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const DELETE = async (
  _req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { storeId, sizeId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    if (!sizeId) return new NextResponse("Missing sizeId", { status: 400 });
    const storeByUserId = await prismadb.store.findUnique({
      where: { id: storeId, userId },
    });
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 401 });
    const deletedSize = await prismadb.size.delete({
      where: {
        id: sizeId,
      },
    });
    return NextResponse.json(deletedSize);
  } catch (err) {
    console.log("[STOREID_SIZES_SIZEID_DELETE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  _req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) => {
  try {
    // const { userId } = auth();
    // if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { storeId, sizeId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    if (!sizeId) return new NextResponse("Missing sizeId", { status: 400 });
    const storeByUserId = await prismadb.store.findUnique({
      where: {
        id: storeId,
        // userId,
      },
    });
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 401 });
    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
        storeId,
      },
    });
    if (!size) return new NextResponse("Size not found", { status: 404 });
    return NextResponse.json(size);
  } catch (err) {
    console.log("[STOREID_SIZES_SIZEID_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { storeId, sizeId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    if (!sizeId) return new NextResponse("Missing sizeId", { status: 400 });
    const { name, value } = await req.json();
    if (!name && !value)
      return new NextResponse("Bad request", { status: 400 });
    const storeByUserId = await prismadb.store.findUnique({
      where: { id: storeId, userId },
    });
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 401 });
    const updatedSize = await prismadb.size.update({
      where: {
        id: sizeId,
      },
      data: {
        name: name || undefined,
        value: value || undefined,
      },
    });
    return NextResponse.json(updatedSize);
  } catch (err) {
    console.log("[STOREID_SIZES_SIZEID_PATCH]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
