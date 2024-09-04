import { Button } from "@nextui-org/button"
import { LogOut } from "lucide-react"

import { signOut } from "@/auth"

export const LogoutButton = () => {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
      className="w-full"
    >
      <Button className="w-full" color="primary" type="submit">
        <LogOut fill="#fff" size={20} />
      </Button>
    </form>
  )
} 