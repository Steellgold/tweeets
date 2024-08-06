import { Button } from "@nextui-org/button";
import { Link} from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { CircleDollarSign, Drum } from "lucide-react";

import { title, subtitle } from "@/components/primitives";
import { cn } from "@/lib/utils";
import { HighlightBadge } from "@/components/HighlightBadge";
import { LoginModal } from "@/components/LoginModal";
import { LoginButton } from "@/components/LoginButton";

const Page = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">

      <HighlightBadge
        badge={{ icon: <Drum size={16} /> }}
        color="#0064d7"
        link={{ href: "https://google.com", isExternal: true }}
        size="sm"
        text="New update, check it out!"
      />

      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Change the way you&nbsp;</h1>
        <h1 className={title({ color: "blue" })}>tweet&nbsp;</h1>
        <h1 className={cn("italic", title())}>forever</h1>

        <h2 className={subtitle({ class: "mt-4" })}>
          A new way to tweet, without braining
        </h2>
      </div>

      <div className="flex gap-3">
        <LoginModal
          action={<LoginButton />}
          button={<Button color="primary">Get Started</Button>}
        />

        <Link className={buttonStyles({ variant: "bordered" })} href="/pricing">
          <CircleDollarSign size={16} />
          Pricing
        </Link>
      </div>
    </section>
  );
}

export default Page;
