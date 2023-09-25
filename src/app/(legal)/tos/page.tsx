/* eslint-disable max-len */
import type { ReactElement } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import Link from "next/link";

const Tos = (): ReactElement => {
  return (
    <div className="flex flex-col items-center justify-center mt-32">
      <Image src={"/tweeets-legal.png"} width={350} height={250} alt={"Tweeets Logo"} className="mb-10" />

      <div className="flex flex-col max-w-2xl w-full mb-40 mt-10">
        <article className={cn(
          "text-muted-foreground whitespace-break-spaces",
          "prose-h1:text-white prose-h1:font-semibold prose-h1:text-lg prose-h1:mt-5",
          "prose-a:text-white prose-a:font-semibold prose-a:text-lg prose-a:mb-4 prose-a:underline"
        )}>
          <h1>Terms of Use for Tweeets</h1>
          <p>Welcome to Tweeets! The use of our service is governed by the following terms. By accessing or using Tweeets, you agree to be bound by these terms. If you disagree with any of these terms, please do not use our service.</p>

          <h1>1. Legal Age of Use and Parental Consent</h1>
          <p><span className="font-bold">1.1.</span> Tweeets integrates with Twitter to provide you with a content generation experience. You must have the legal age required to use Twitter in your jurisdiction to use Tweeets.</p>
          <p><span className="font-bold">1.2.</span> If you are a minor user (according to the laws of your jurisdiction) and wish to use Tweeets, you must obtain permission from a parent or legal guardian before starting to use the service.</p>

          <h1>2. Use of Generated Content</h1>
          <p><span className="font-bold">2.1.</span> Tweeets generates content based on defined templates and limits. You agree not to intentionally bypass these limits to obtain unauthorized content.</p>
          <p><span className="font-bold">2.2.</span> Any attempt to circumvent generation systems or manipulate limits constitutes a violation of our terms of use.</p>

          <h1>3. Disciplinary Measures</h1>
          <p><span className="font-bold">3.1.</span> If we have reason to believe that you are attempting to bypass limits or obtain unauthorized content by manipulating our system, we reserve the right to take appropriate action.</p>
          <p><span className="font-bold">3.2.</span> These measures may include, but are not limited to, deactivating your Tweeets account, with or without notice, depending on the severity of the violation.</p>

          <h1>4. Changes and Updates</h1>
          <p><span className="font-bold">4.1.</span> Tweeets reserves the right to modify these terms of use at any time. Changes will take effect upon publication on our platform.</p>
          <p><span className="font-bold">4.2.</span> It is your responsibility to regularly check these terms to stay informed about any updates.</p>

          <h1>5. General Provisions</h1>
          <p><span className="font-bold">5.1.</span> By using Tweeets, you acknowledge that you have read, understood, and agreed to these terms of use.</p>
          <p><span className="font-bold">5.2.</span> You understand that the use of Tweeets is subject to our privacy policy, which governs how we handle your information.</p>
          <p><span className="font-bold">5.3.</span> You agree to comply with applicable laws and regulations when using Tweeets.</p>

          <h1>6. Contact</h1>
          <p>By using Tweeets, you confirm your understanding and agreement with these terms of use. If you have any questions or concerns, please contact us at <Link href={"mailto:contact@tweeets.app"}>contact@tweeets.app</Link>.</p>
          <p>Thank you for using Tweeets and trusting our service.</p>
        </article>
      </div>
    </div>
  );
};

export default Tos;