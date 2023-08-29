import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import NavBar from "@/components/navbar";
import prismadb from "@/lib/prismadb";

const DashboardLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const { storeId } = params;
  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });
  if (!store) redirect("/");

  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

export default DashboardLayout;
