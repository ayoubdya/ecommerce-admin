import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

import OrderClient from "./components/client";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const OrderPage = async ({ params }: { params: { storeId: string } }) => {
  const { storeId } = params;

  const orders = await prismadb.order.findMany({
    where: { storeId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    isPaid: order.isPaid,
    phone: order.phone,
    address: order.address,
    products: order.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    total: formatter.format(
      order.orderItems.reduce(
        (total, orderItem) =>
          total + orderItem.product.price.toNumber() * orderItem.quantity,
        0
      )
    ),
    createdAt: format(order.createdAt, "dd MMMM yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrderPage;
