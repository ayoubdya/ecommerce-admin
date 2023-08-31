import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs";
import { Image, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { boolean } from "zod";

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
    const {
      name,
      price,
      images,
      categoryId,
      sizeId,
      colorId,
      isFeatured,
      isArchived,
    }: Prisma.ProductGetPayload<{
      include: { images: true };
    }> = await req.json();
    if (!name) return new NextResponse("Missing label", { status: 400 });
    if (!images) return new NextResponse("Missing images", { status: 400 });
    if (!categoryId)
      return new NextResponse("Missing categoryId", { status: 400 });
    if (!sizeId) return new NextResponse("Missing sizeId", { status: 400 });
    if (!colorId) return new NextResponse("Missing colorId", { status: 400 });

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        sizeId,
        colorId,
        isArchived,
        isFeatured,
        storeId,
        images: {
          createMany: {
            data: images,
          },
        },
      },
    });

    // const uploadedImages = await prismadb.image.createMany({
    //   data: images.map((image: Image) => ({
    //     ...image,
    //     productId: product.id,
    //   })),
    // });

    return NextResponse.json(product);
  } catch (err) {
    console.log("[STOREID_PRODUCTS_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    // const { userId } = auth();
    // if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { searchParams } = new URL(req.url);
    const sizeId = searchParams.get("sizeId");
    const colorId = searchParams.get("colorId");
    const categoryId = searchParams.get("categoryId");
    const isFeatured = searchParams.get("isFeatured");

    const { storeId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    const products = await prismadb.product.findMany({
      where: {
        storeId,
        sizeId: sizeId || undefined,
        colorId: colorId || undefined,
        categoryId: categoryId || undefined,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        size: true,
        color: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(products);
  } catch (err) {
    console.log("[STOREID_PRODUCTS_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
