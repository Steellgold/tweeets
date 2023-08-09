import type { Metadata } from "next";

const data = {
  title: "Tweeets",
  description: [
    "Generate tweets using IA, based with your own tweets or your own parameters.",
    "Share your tweets models with your friends and the world."
  ].join(" "),
  siteName: "Tweeets"
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tweeets.app/"),

  title: {
    template: "%s - " + data.title,
    default: data.title,
    absolute: data.title
  },
  description: data.description,
  applicationName: data.siteName,

  themeColor: "#0d0d11",

  openGraph: {
    title: {
      template: "%s - " + data.title,
      default: data.title,
      absolute: data.title
    },
    description: data.description,
    siteName: data.siteName,
    url: "https://tweeets.app/",
    type: "website",
    images: ["/assets/tweeets.png"]
  },

  twitter: {
    title: {
      template: "%s - " + data.title,
      default: data.title,
      absolute: data.title
    },
    description: data.description
  }
};