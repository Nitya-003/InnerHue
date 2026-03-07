import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.GITHUB_ACTIONS ? "/InnerHue" : "";

  return {
    name: "InnerHue",
    short_name: "InnerHue",
    description: "A calm daily companion for reflection and balance",
    start_url: `${basePath}/`,
    display: "standalone",
    orientation: "portrait",
    background_color: "#F5F7F6",
    theme_color: "#7FB7A3",
    icons: [
      {
        src: `${basePath}/icons/android/android-launchericon-192-192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${basePath}/icons/android/android-launchericon-512-512.png`,
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: `${basePath}/icons/image.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}