import { MenuItemProps } from "../types/menu";

export const MENU_ITEMS: MenuItemProps[] = [
  {
    title: "Home",
    href: "/home",
    isShow: true,
    isExternal: false,
    eventName: "Section: Home",
    type: "Section",
  },
  {
    title: "Watchlist",
    href: "/watchlist",
    isShow: true,
    isExternal: false,
    eventName: "Section: Watchlist",
    type: "Section",
  },
  {
    title: "Log",
    href: "/log/new",
    isShow: true,
    isExternal: false,
    eventName: "Section: Log",
    type: "Section",
  },
  {
    title: "Suggest",
    href: "/suggest",
    isShow: true,
    isExternal: false,
    eventName: "Section: Suggest",
    type: "Section",
  },
  {
    title: "Notifications",
    href: "/notifications",
    isShow: true,
    isExternal: false,
    eventName: "Section: Notifications",
    type: "Section",
  },
  {
    title: "Settings",
    href: "/settings",
    isShow: true,
    isExternal: false,
    eventName: "Section: Settings",
    type: "Section",
  },
];
