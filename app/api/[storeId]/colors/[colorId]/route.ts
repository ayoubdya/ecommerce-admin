import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const DELETE = async (
  _req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { storeId, colorId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    if (!colorId) return new NextResponse("Missing colorId", { status: 400 });
    const storeByUserId = await prismadb.store.findUnique({
      where: { id: storeId, userId },
    });
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 401 });
    const deletedColor = await prismadb.color.delete({
      where: {
        id: colorId,
      },
    });
    return NextResponse.json(deletedColor);
  } catch (err) {
    console.log("[STOREID_COLORS_COLORID_DELETE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  _req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) => {
  try {
    // const { userId } = auth();
    // if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { storeId, colorId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    if (!colorId) return new NextResponse("Missing colorId", { status: 400 });
    const storeByUserId = await prismadb.store.findUnique({
      where: {
        id: storeId,
        // userId,
      },
    });
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 401 });
    const color = await prismadb.color.findUnique({
      where: {
        id: colorId,
        storeId,
      },
    });
    if (!color) return new NextResponse("Color not found", { status: 404 });
    return NextResponse.json(color);
  } catch (err) {
    console.log("[STOREID_COLORS_COLORID_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { storeId, colorId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    if (!colorId) return new NextResponse("Missing colorId", { status: 400 });
    const { name, value } = await req.json();
    if (!name && !value)
      return new NextResponse("Bad request", { status: 400 });
    const storeByUserId = await prismadb.store.findUnique({
      where: { id: storeId, userId },
    });
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 401 });
    const updatedColor = await prismadb.color.update({
      where: {
        id: colorId,
      },
      data: {
        name: name || undefined,
        value: value || undefined,
      },
    });
    return NextResponse.json(updatedColor);
  } catch (err) {
    console.log("[STOREID_COLORS_COLORID_PATCH]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
