import { Button } from "@nextui-org/button";
import { Link} from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { CircleDollarSign } from "lucide-react";

import { title, subtitle } from "@/components/primitives";

const Page = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Change the way you&nbsp;</h1>
        <h1 className={title({ color: "blue" })}>tweet</h1>

        <br />

        
        <h2 className={subtitle({ class: "mt-4" })}>
          Post your tweets with your tweets
        </h2>
      </div>

      <div className="flex gap-3">
        <Button color="primary" radius="sm">
          Get Started
        </Button>

        <Link className={buttonStyles({ variant: "bordered" })} href="/pricing">
          <CircleDollarSign size={16} />
          Pricing
        </Link>
      </div>
    </section>
  );
}

export default Page;
