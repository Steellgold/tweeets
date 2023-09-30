"use client";

import { Markdown } from "@/lib/components/markdown";
import { LoginWithTwitter } from "@/lib/components/navbar/login-with-twitter";
import { Card } from "@/lib/components/ui/card";
import CardSpotlight from "@/lib/components/ui/card-spotlight";
import TitleAndSubTitle from "@/lib/components/ui/title/with-sub";
import type { Lang } from "@/lib/configs/generation/langs";
import { getLangKeyByNav, isLanguageSupported } from "@/lib/configs/generation/langs";
import { useUserContext } from "@/lib/contexts/UserProvider";
import { fetcher } from "@/lib/utils/fetcher";
import type { Prisma } from "@prisma/client";
import Image from "next/image";
import { useState, type ReactElement, useEffect } from "react";
import useSWR from "swr";

type BlogPostProps = Prisma.PostsGetPayload<{
  include: {
    author: { include: { posts: false } };
    tags: true;
    categories: true;
    comments: true;
    variants: true;
  };
}>;

type PageProps = {
  params: {
    slug: string;
  };
};

const Blog = ({ params }: PageProps): ReactElement => {
  const { user } = useUserContext();
  const { data, isLoading } = useSWR<BlogPostProps>(`${process.env.NEXT_PUBLIC_URL ?? "https://tweeets.app"}/api/blog?slug=${params.slug}`, fetcher);
  const [browserLanguage, setBrowserLanguage] = useState<Lang | null>(null);

  useEffect(() => {
    if (navigator && navigator.language) {
      if (isLanguageSupported(navigator.language)) return setBrowserLanguage(getLangKeyByNav(navigator.language));
      setBrowserLanguage("en-US");
    }
  }, []);

  if (isLoading) return <></>;

  if (!data) return (
    <div className="mx-auto flex flex-col items-center justify-center max-w-screen-2xl mt-10 mb-10" suppressHydrationWarning>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center w-full px-4">
          <TitleAndSubTitle title="404" subtitle="This blog post does not exist." type="error" subtitleSize={100} />
        </div>
      </div>
    </div>
  );

  // if not connected and post not public show same page but with a message saying this post is private (only for connected users)
  if (!user && !data.isPublic) return (
    <div className="mx-auto flex flex-col items-center justify-center max-w-screen-2xl mt-10" suppressHydrationWarning>
      <div className="flex flex-col items-center justify-center mb-10 px-4">
        <CardSpotlight hoverEffect={false}>
          <Image src={data?.coverUrl ?? "/images/placeholder.png"} alt="Tweeets Blog" width={900} height={600} className="rounded-md" />
        </CardSpotlight>
        <div className="flex flex-col items-center w-full px-4 mt-3">
          <TitleAndSubTitle
            title={data?.variants
              ? data?.variants.find((variant) => variant.lang == browserLanguage)?.title ?? data?.title ?? "No title"
              : data?.title ?? "No title"
            }

            subtitle={data?.variants
              ? data?.variants.find((variant) => variant.lang == browserLanguage)?.excerpt ?? data?.excerpt ?? "No excerpt"
              : data?.excerpt ?? "No excerpt"
            }
            type="default"
            subtitleSize={100} />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mb-10 px-4 w-full">
        <Card className="px-4 py-4">
          <div className="flex flex-col items-center w-full px-4 mt-3">
            <p className="text-center text-gray-500">You must be connected to see this post.</p>
            <LoginWithTwitter />
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="mx-auto flex flex-col items-center justify-center max-w-screen-2xl mt-10" suppressHydrationWarning>
      <div className="flex flex-col items-center justify-center mb-10 px-4">
        <CardSpotlight hoverEffect={false}>
          <Image src={data?.coverUrl ?? "/images/placeholder.png"} alt="Tweeets Blog" width={900} height={600} className="rounded-md" />
        </CardSpotlight>
        <div className="flex flex-col items-center w-full px-4 mt-3">
          <TitleAndSubTitle
            title={data?.variants
              ? data?.variants.find((variant) => variant.lang == browserLanguage)?.title ?? data?.title ?? "No title"
              : data?.title ?? "No title"
            }

            subtitle={data?.variants
              ? data?.variants.find((variant) => variant.lang == browserLanguage)?.excerpt ?? data?.excerpt ?? "No excerpt"
              : data?.excerpt ?? "No excerpt"
            }
            type="default"
            subtitleSize={100} />
        </div>
      </div>

      <div className="flex flex-col items-center w-full px-4 mt-3 mb-10">
        <Markdown
          source={data?.variants.find((variant) => variant.lang == browserLanguage)?.content ?? data?.content ?? "No content"}
          className="prose max-w-none w-[50%]" />
      </div>
    </div>
  );
};

export default Blog;