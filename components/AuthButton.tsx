import { signIn, signOut, auth } from "@/lib/auth"
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
import { LayoutDashboard, LogOut, CreditCard } from "lucide-react"

export default async function AuthButton() {
  const session = await auth()

  if (!session?.user) {
    return (
      <form
        action={async () => {
          "use server"
          await signIn("google")
        }}
      >
        <Button variant="outline" type="submit">ورود با گوگل</Button>
      </form>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
            <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name}</p>
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
                <span>حساب کاربری و پلن</span>
            </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
            <form
                action={async () => {
                  "use server"
                  await signOut()
                }}
                className="w-full"
            >
                <button type="submit" className="flex w-full items-center">
                    <LogOut className="me-2 h-4 w-4" />
                    <span>خروج</span>
                </button>
            </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
