import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const DELETE = async (
  _req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { storeId, billboardId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    if (!billboardId)
      return new NextResponse("Missing billboardId", { status: 400 });
    const storeByUserId = await prismadb.store.findUnique({
      where: { id: storeId, userId },
    });
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 401 });
    const deletedBillboard = await prismadb.billboard.delete({
      where: {
        id: billboardId,
      },
    });
    return NextResponse.json(deletedBillboard);
  } catch (err) {
    console.log("[STOREID_BILLBOARDS_BILLBOARDID_DELETE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  _req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) => {
  try {
    // const { userId } = auth();
    // if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { storeId, billboardId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    if (!billboardId)
      return new NextResponse("Missing billboardId", { status: 400 });
    // const billboard = await prismadb.billboard.findUnique({
    //   where: {
    //     id: billboardId,
    //     Store: {
    //       id: storeId,
    //       userId
    //     }
    //   },
    // })
    const storeByUserId = await prismadb.store.findUnique({
      where: {
        id: storeId,
        // userId,
      },
    });
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 401 });
    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
        storeId,
      },
    });
    if (!billboard)
      return new NextResponse("Billboard not found", { status: 404 });
    return NextResponse.json(billboard);
  } catch (err) {
    console.log("[STOREID_BILLBOARDS_BILLBOARDID_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { storeId, billboardId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    if (!billboardId)
      return new NextResponse("Missing billboardId", { status: 400 });
    const { label, imageUrl } = await req.json();
    if (!label && !imageUrl)
      return new NextResponse("Bad request", { status: 400 });
    const storeByUserId = await prismadb.store.findUnique({
      where: { id: storeId, userId },
    });
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 401 });
    const updatedBillboard = await prismadb.billboard.update({
      where: {
        id: billboardId,
      },
      data: {
        label: label || undefined,
        imageUrl: imageUrl || undefined,
      },
    });
    return NextResponse.json(updatedBillboard);
  } catch (err) {
    console.log("[STOREID_BILLBOARDS_BILLBOARDID_PATCH]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
