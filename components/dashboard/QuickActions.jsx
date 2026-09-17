"use client";

import {
  MdPerson,
  MdReceiptLong,
  MdPeople,
  MdAssessment,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const actions = [
  { label: "New member", href: "/members", icon: MdPeople },
  { label: "Day book", href: "/reports/day-book", icon: MdAssessment },
  { label: "Transactions", href: "/transactions", icon: MdReceiptLong },
  { label: "Profile", href: "/profile", icon: MdPerson },
];

const QuickActions = () => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            className="hidden h-9 shrink-0 px-2 text-chrome-foreground/80 hover:bg-white/10 hover:text-chrome-foreground sm:inline-flex"
          />
        }
      >
        Quick
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <DropdownMenuItem
                key={action.href}
                className="cursor-pointer gap-2"
                onClick={() => router.push(action.href)}
              >
                <Icon className="text-primary" />
                {action.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default QuickActions;
