import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const DELETE = async (
  _req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { storeId, categoryId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    if (!categoryId)
      return new NextResponse("Missing categoryId", { status: 400 });
    const storeByUserId = await prismadb.store.findUnique({
      where: { id: storeId, userId },
    });
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 401 });
    const deletedCategory = await prismadb.category.delete({
      where: {
        id: categoryId,
      },
    });
    return NextResponse.json(deletedCategory);
  } catch (err) {
    console.log("[STOREID_CATEGORIES_CATEGORYID_DELETE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  _req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) => {
  try {
    // const { userId } = auth();
    // if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { storeId, categoryId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    if (!categoryId)
      return new NextResponse("Missing categoryId", { status: 400 });
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
    const category = await prismadb.category.findUnique({
      where: {
        id: categoryId,
        storeId,
      },
    });
    if (!category)
      return new NextResponse("Category not found", { status: 404 });
    return NextResponse.json(category);
  } catch (err) {
    console.log("[STOREID_CATEGORIES_CATEGORYID_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { storeId, categoryId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    if (!categoryId)
      return new NextResponse("Missing categoryId", { status: 400 });
    const { name, billboardId } = await req.json();
    if (!name && !billboardId)
      return new NextResponse("Bad request", { status: 400 });
    const storeByUserId = await prismadb.store.findUnique({
      where: { id: storeId, userId },
    });
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 401 });
    const updatedCategory = await prismadb.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: name || undefined,
        billboardId: billboardId || undefined,
      },
    });
    return NextResponse.json(updatedCategory);
  } catch (err) {
    console.log("[STOREID_CATEGORIES_CATEGORYID_PATCH]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
