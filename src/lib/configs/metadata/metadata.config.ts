import type { Metadata } from "next";

const data = {
  title: "Tweeets",
  description: [
    "Analyse your last tweets and ask AI to generate new ones like you."
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

  themeColor: "#0ea5e9",

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
    images: ["/tweeets.png"]
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