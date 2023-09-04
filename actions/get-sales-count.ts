import prismadb from "@/lib/prismadb";

export default async function getSalesCount(storeId: string) {
  const ordersCount = await prismadb.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  });

  return ordersCount;
}
