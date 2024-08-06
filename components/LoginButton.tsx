import { Button } from "@nextui-org/button"
import { TwitterIcon } from "lucide-react"

import { signIn } from "@/auth"

export const LoginButton = () => {
  return (
    <form
      action={async () => {
        "use server"
        console.log("signing in with Twitter")
        await signIn("twitter")
      }}
    >
      <Button className="w-full" color="primary" type="submit">
        <TwitterIcon fill="#fff" size={20} />
      </Button>
    </form>
  )
} 