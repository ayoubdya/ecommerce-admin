import prismadb from "@/lib/prismadb";

export interface GraphData {
  name: string;
  total: number;
}

export async function getGraphRevenue(storeId: string) {
  const paidOrders = await prismadb.order.findMany({
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

  const monthlyRevenue: { [key: number]: number } = {};

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth();
    const revenue = order.orderItems.reduce(
      (acc, orderItem) => acc + orderItem.product.price.toNumber(),
      0
    );
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenue;
  }

  const graphData: GraphData[] = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Aug", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dec", total: 0 },
  ];

  for (const month_idx in monthlyRevenue) {
    graphData[+month_idx].total = monthlyRevenue[+month_idx];
  }

  return graphData;
}
