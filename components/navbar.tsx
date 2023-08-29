import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import MainNav from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import prismadb from "@/lib/prismadb";

const NavBar = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="flex items-center p-4 border-b-2">
      <div className="flex">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
      </div>
      <div className="ml-auto">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default NavBar;
