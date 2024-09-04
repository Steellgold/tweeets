import { Card, CardFooter, CardHeader } from "@nextui-org/card"
import { Chip } from "@nextui-org/chip"
import { Button } from "@nextui-org/button"
import { Mail } from "lucide-react"

import { EmailRequiredModal } from "@/components/modals/EmailRequiredModal"

export const EmailRequiredComponent = () => {
  return (
    <Card className="sm:max-w-[610px] w-full border-2 border-[#f31260] bg-[#f3126010]">
      <CardHeader className="flex flex-col items-start">
        <Chip className="mb-1" color="danger">Uhm, wait!</Chip>
        We haven&apos;t received your email from Twitter, please provide it to continue.
      </CardHeader>

      <CardFooter className="flex justify-end">
        <EmailRequiredModal button={
          <Button color="danger" size="sm">
            <Mail size={16} />
            Add your email
          </Button>
        } />
      </CardFooter>
    </Card>
  )
}