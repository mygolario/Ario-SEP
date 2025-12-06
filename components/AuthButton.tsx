import { signIn, signOut, auth } from "@/lib/auth"
import { Button } from "./ui/button"
import Link from 'next/link';

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
        <Button variant="outline" type="submit">Sign in with Google</Button>
      </form>
    )
  }

  return (
    <div className="flex gap-4 items-center">
      <Link href="/dashboard">
        <Button variant="ghost">Dashboard</Button>
      </Link>
      <div className="flex flex-col items-end">
        <span className="text-sm font-medium">{session.user.name}</span>
        <span className="text-xs text-muted-foreground">{session.user.email}</span>
      </div>
      <form
        action={async () => {
          "use server"
          await signOut()
        }}
      >
        <Button variant="ghost" size="sm" type="submit">Sign out</Button>
      </form>
    </div>
  )
}
