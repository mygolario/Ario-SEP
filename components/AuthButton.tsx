import { getSession } from "@/lib/session"
import { Button } from "./ui/button"
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, CreditCard } from "lucide-react"
import LogoutButton from "./LogoutButton";

export default async function AuthButton() {
  const session = await getSession()

  if (!session?.user) {
    return (
      <Button asChild variant="default" className="bg-indigo-600 hover:bg-indigo-700 text-white border-0">
         <Link href="/login">ورود / ثبت نام</Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full border">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
            <AvatarFallback>{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
            <Link href="/dashboard" className="cursor-pointer w-full flex items-center">
                <LayoutDashboard className="me-2 h-4 w-4" />
                <span>داشبورد</span>
            </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
             <Link href="/account" className="cursor-pointer w-full flex items-center">
                <CreditCard className="me-2 h-4 w-4" />
                <span>حساب کاربری</span>
            </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
             <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
