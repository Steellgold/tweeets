/* eslint-disable max-len */
import type { ReactElement } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const PrivacyPolicy = (): ReactElement => {
  return (
    <div className="flex flex-col items-center justify-center mt-32">
      <Image src={"/tweeets-legal.png"} width={350} height={250} alt={"Tweeets Logo"} className="mb-10" />

      <div className="flex flex-col max-w-2xl w-full mb-40 mt-10">
        <article className={cn(
          "text-muted-foreground whitespace-break-spaces",
          "prose-h1:text-white prose-h1:font-semibold prose-h1:text-lg prose-h1:mt-5",
          "prose-a:text-white prose-a:font-semibold prose-a:text-lg prose-a:mb-4 prose-a:underline",
        )}>
          We value the privacy of your personal data. This privacy policy explains how Tweeets.app collects, uses, stores, and protects your information when you use our service. Please read this policy carefully to understand how we handle your data.

          <h1>1. Data Collection</h1>

          <p>Tweeets.app is an open-source service that respects your privacy. We do not collect any personal data without necessity. When you use our service, we may collect the following information:</p>
          <p>- Information you voluntarily provide: When using Tweeets.app, you may choose to provide us with certain information, such as context or settings to generate a tweet.</p>

          <h1>2. Use of Data</h1>
          <p>We use the collected data for the following purposes:</p>
          <p>- Providing and improving our service: We use your information to provide you with the Tweeets.app service and constantly enhance our platform. (Settings, Context)</p>
          <p>- Communication with you: We may use your information to contact you regarding service updates, new features, or other relevant information. (Emails)</p>
          <p>- Compliance with legal obligations: In certain cases, we may be required to disclose your personal information to comply with applicable laws and regulations.</p>

          <h1>3. Data Storage</h1>
          <p>We take appropriate security measures to protect your data against unauthorized access.</p>

          <h1>4. Data Sharing</h1>
          <p>We do not share your personal data with third parties, except in the following cases:</p>
          <p>- Legal obligations: We may be obligated to disclose your personal information if the law requires it or if we believe in good faith that such disclosure is necessary to protect our rights, your safety, or the safety of others.</p>
          <p>- When subscribing to a service: We may share your personal information with third parties when you subscribe to a service. We only share the necessary information to provide the service. (Email)</p>

          <h1>5. Your Rights</h1>
          <p>You have certain rights concerning your personal data. You can request access, correction, or deletion of your data. You can also object to the processing of your data or request limitations on their use. To exercise these rights, please contact us at <Link href={"mailto:privacy@tweeets.app"}>privacy@tweeets.app</Link>.</p>

          <h1>6. Changes to the Privacy Policy</h1>
          <p>We may update this privacy policy from time to time. We encourage you to regularly check this page for any modifications. By continuing to use Tweeets.app after the publication of changes, you accept the terms of the updated privacy policy.</p>

          <h1>7. Contact Us</h1>
          <p>If you have questions, concerns, or requests regarding this privacy policy, please contact us at <Link href={"mailto:privacy@tweeets.app"}>privacy@tweeets.app</Link>.</p>
          <p>Thank you for choosing Tweeets and trusting us with the protection of your personal data.</p>
        </article>
      </div>
    </div>
  );
};

export default PrivacyPolicy;