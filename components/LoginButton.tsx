import { Button } from "@nextui-org/button"
import { TwitterIcon } from "lucide-react"

import { signIn } from "@/auth"

export const LoginButton = () => {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("twitter")
      }}
      className="w-full"
    >
      <Button className="w-full" color="primary" type="submit">
        <TwitterIcon fill="#fff" size={20} />
      </Button>
    </form>
  )
} 