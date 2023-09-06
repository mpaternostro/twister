"use client";

import * as React from "react";
import { Button } from "#/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Icon } from "#components/ui/icon";
import { setThemeAction } from "./actions";

export function ThemeSwitch() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Icon
            name="sun"
            className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <Icon
            name="moon"
            className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" asChild>
        <form action={setThemeAction}>
          <DropdownMenuItem asChild>
            <button type="submit" name="theme" value="light" className="w-full">
              Light
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button type="submit" name="theme" value="dark" className="w-full">
              Dark
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button
              type="submit"
              name="theme"
              value="system"
              className="w-full"
            >
              System
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
