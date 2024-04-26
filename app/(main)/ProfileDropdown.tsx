"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Icon } from "#components/ui/icon";

import { setThemeAction } from "./actions";

interface Props {
  avatarUrl: string | null;
  handle: string;
  userName: string;
}

export function ProfileDropdown({ avatarUrl, handle, userName }: Props) {
  const [openMenu, setOpenMenu] = useState(false);
  const [openThemeSwitch, setOpenThemeSwitch] = useState(false);

  return (
    <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
      <DropdownMenuTrigger>
        {avatarUrl ? (
          <Image
            src={`avatar/${avatarUrl}`}
            alt={`${userName} profile photo`}
            className="aspect-square h-8 w-8 rounded-full object-cover"
            width={32}
            height={32}
            priority
          />
        ) : (
          <div className="mr-3 rounded-full border bg-muted">
            <Icon
              name="person"
              className="-m-[1px] h-8 w-8 p-1.5 text-muted-foreground"
            />
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{`Hey, ${userName}`}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/${handle}`}>
              <Icon name="person" className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          {/*
            Button key-value pair is not passed to form when using the `form` attribute,
            so we need a form for each theme. 
            */}
          <form
            action={setThemeAction}
            id="light-theme-switch-form"
            hidden
            className="hidden"
          >
            <input hidden type="hidden" name="theme" value="light" />
          </form>
          <form
            action={setThemeAction}
            id="dark-theme-switch-form"
            hidden
            className="hidden"
          >
            <input hidden type="hidden" name="theme" value="dark" />
          </form>
          <form
            action={setThemeAction}
            id="system-theme-switch-form"
            hidden
            className="hidden"
          >
            <input hidden type="hidden" name="theme" value="system" />
          </form>
          <DropdownMenuSub
            open={openThemeSwitch}
            onOpenChange={setOpenThemeSwitch}
          >
            <DropdownMenuSubTrigger>
              <Icon name="sun" className="mr-2 h-4 w-4 dark:opacity-0" />
              <Icon
                name="moon"
                className="absolute mr-2 h-4 w-4 opacity-0 dark:opacity-100"
              />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem className="p-0">
                  <button
                    type="submit"
                    form="light-theme-switch-form"
                    className="w-full px-2 py-1.5 text-left"
                  >
                    <Icon name="sun" className="mr-2 h-4 w-4" />
                    <span>Light</span>
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <button
                    type="submit"
                    form="dark-theme-switch-form"
                    className="w-full px-2 py-1.5 text-left"
                  >
                    <Icon name="moon" className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <button
                    type="submit"
                    form="system-theme-switch-form"
                    className="w-full px-2 py-1.5 text-left"
                  >
                    <Icon name="laptop" className="mr-2 h-4 w-4" />
                    <span>System</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <form action="/auth/sign-out" method="post" className="w-full">
            <button className="w-full px-2 py-1.5 text-left">
              <Icon name="exit" className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
