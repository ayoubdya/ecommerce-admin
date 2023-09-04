import prismadb from "@/lib/prismadb";

export default async function getTotalRevenue(storeId: string) {
  const orders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const total = orders.reduce(
    (acc, order) =>
      acc +
      order.orderItems.reduce(
        (acc_, orderItem) => acc_ + orderItem.product.price.toNumber(),
        0
      ),
    0
  );

  return total.toFixed(2);
}
