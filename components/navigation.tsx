import { MENU_ITEMS } from "@/constant/menu";
import Link from "next/link";

export default function Navigation() {
  const menus = MENU_ITEMS.filter((item) => item.isShow);

  return (
    <ul className="border-2 border-red-600 flex gap-4">
      {menus.map((menu) => (
        <Link key={menu.title} className="cursor-pointer" href={menu.href}>
          {menu.title}
        </Link>
      ))}
    </ul>
  );
}
