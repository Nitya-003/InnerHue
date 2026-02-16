export const dynamic = "force-static";


import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "InnerHue",
    short_name: "InnerHue",
    description: "A calm daily companion for reflection and balance",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#F5F7F6",
    theme_color: "#7FB7A3",
    icons: [
      {
        src: "/icons/android/android-launchericon-192-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/android/android-launchericon-512-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/image.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
