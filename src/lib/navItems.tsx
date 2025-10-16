import type { ComponentType } from "react";
import { FolderIcon } from "~/components/icons/Folder";
import { Forms } from "~/components/icons/Forms";
import { HomeIcon } from "~/components/icons/Home";
import { LeadsIcon } from "~/components/icons/Leads";
import { ExchangeIcon } from "~/components/icons/Exchange";
import { AppsIcon } from "~/components/icons/Apps";
import { SettingsIcon } from "~/components/icons/Settings";
export type NavItem = {
  title: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

export const mainNav: NavItem[] = [
  { title: "Overview", href: "/overview", icon: HomeIcon },
  { title: "Funnels", href: "/funnels", icon: Forms },
  { title: "Leads", href: "/leads", icon: LeadsIcon },
  { title: "Segments", href: "/segments", icon: FolderIcon },
  { title: "Workflows", href: "/workflows", icon: ExchangeIcon },
  { title: "Integrations", href: "/integrations", icon: AppsIcon },
  { title: "Settings", href: "/settings", icon: SettingsIcon },
];
