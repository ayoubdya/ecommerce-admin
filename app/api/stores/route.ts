import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    const { name } = await req.json();
    if (!name) return new NextResponse("Missing name", { status: 400 });
    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });
    return NextResponse.json(store);
  } catch (err) {
    console.log("STORES_POST", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
