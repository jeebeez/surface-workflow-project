"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "~/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ChevronDownIcon, UserIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { CircleLineIcon } from "~/components/icons/CircleLine";
import { mainNav } from "~/lib/navItems";

export function AppSidebar() {
  const { open } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    router.push(href);
  };
  return (
    <Sidebar className={`bg-sidebar ${open ? "px-4 py-5" : "px-2 py-1"}`}>
      <SidebarHeader className="">
        <div className="px-2 pt-1">
          {open ? (
            <Image
              src="/assets/logo.png"
              alt="Brand"
              width={170}
              height={30}
              className="rounded-sm"
            />
          ) : null}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarSeparator className="my-2" />
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <UserIcon className="size-4" />
                    My Workspace <ChevronDownIcon className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-full">
                  <DropdownMenuItem>
                    <span>Acme Inc</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Acme Corp.</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarSeparator className="my-2" />

          <SidebarMenuItem>
            <SidebarMenuButton isActive={pathname === "/onboarding"} asChild>
              <button
                type="button"
                className="w-full"
                onClick={() => handleNavigation("/onboarding")}
              >
                <CircleLineIcon className="size-4" />
                <span>Getting started</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarSeparator className="my-2" />
        </SidebarMenu>

        <SidebarMenu>
          {mainNav.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
              >
                <button
                  type="button"
                  className={cn(
                    "w-full",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                  onClick={() => handleNavigation(item.href)}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Static for now later user info will be dynamic */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 rounded-md p-2">
              <Avatar className="size-6">
                <AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
                <AvatarFallback>CH</AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium">Chris Hood</span>
                <span className="text-muted-foreground truncate text-xs">
                  hello@example.com
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
