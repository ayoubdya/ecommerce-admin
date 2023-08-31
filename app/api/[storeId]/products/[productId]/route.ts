import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { Image, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const DELETE = async (
  _req: Request,
  { params }: { params: { storeId: string; productId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { storeId, productId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    if (!productId)
      return new NextResponse("Missing productId", { status: 400 });
    const storeByUserId = await prismadb.store.findUnique({
      where: { id: storeId, userId },
    });
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 401 });
    const deletedProducts = await prismadb.product.delete({
      where: {
        id: productId,
      },
    });
    return NextResponse.json(deletedProducts);
  } catch (err) {
    console.log("[STOREID_PRODUCTS_PRODUCTID_DELETE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  _req: Request,
  { params }: { params: { storeId: string; productId: string } }
) => {
  try {
    // const { userId } = auth();
    // if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { storeId, productId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    if (!productId)
      return new NextResponse("Missing productId", { status: 400 });
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
    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
        storeId,
      },
      include: {
        images: true,
        size: true,
        color: true,
        category: true,
      },
    });
    if (!product) return new NextResponse("Product not found", { status: 404 });
    return NextResponse.json(product);
  } catch (err) {
    console.log("[STOREID_PRODUCTS_PRODUCTID_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { storeId, productId } = params;
    if (!storeId) return new NextResponse("Missing storeId", { status: 400 });
    if (!productId)
      return new NextResponse("Missing productId", { status: 400 });
    type ProductWithImages = Prisma.ProductGetPayload<{
      include: { images: true };
    }>;
    const {
      name,
      price,
      images,
      categoryId,
      sizeId,
      colorId,
      isFeatured,
      isArchived,
    }: ProductWithImages = await req.json();
    if (!name) return new NextResponse("Missing name", { status: 400 });
    if (!images) return new NextResponse("Missing images", { status: 400 });
    if (!categoryId)
      return new NextResponse("Missing categoryId", { status: 400 });
    if (!sizeId) return new NextResponse("Missing sizeId", { status: 400 });
    if (!colorId) return new NextResponse("Missing colorId", { status: 400 });
    const storeByUserId = await prismadb.store.findUnique({
      where: { id: storeId, userId },
    });
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 401 });
    await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        name: name || undefined,
        price: price || undefined,
        categoryId: categoryId || undefined,
        sizeId: sizeId || undefined,
        colorId: colorId || undefined,
        isFeatured,
        isArchived,
        images: {
          deleteMany: {},
          // createMany: {
          //   data: images,
          // },
        },
      },
    });

    const updatedProduct = await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        images: {
          createMany: {
            data: images,
          },
        },
      },
    });

    // const oldImages = await prismadb.image.findMany({
    //   where: {
    //     productId,
    //   },
    // });

    // const toDelete = oldImages.filter(
    //   (oldImage) => !images.map((image) => image.url).includes(oldImage.url)
    // );
    // const newImages = images.filter(
    //   (image) => !oldImages.map((oldImage) => oldImage.url).includes(image.url)
    // );

    // await prismadb.image.deleteMany({
    //   where: {
    //     id: {
    //       in: toDelete.map((image) => image.id),
    //     },
    //   },
    // });

    // const uploadedImages = await prismadb.image.createMany({
    //   data: newImages.map((image: Image) => ({
    //     ...image,
    //     productId: updatedProduct.id,
    //   })),
    // });

    return NextResponse.json(updatedProduct);
  } catch (err) {
    console.log("[STOREID_PRODUCTS_PRODUCTID_PATCH]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
