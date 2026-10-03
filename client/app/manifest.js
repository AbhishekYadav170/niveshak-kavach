export default function manifest() {
  return {
    name: "निवेशक कवच | Niveshak Kavach",
    short_name: "Niveshak Kavach",
    description: "Check suspicious investment messages in 10 seconds, in Hindi and by voice.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7ee",
    theme_color: "#7a1020",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
