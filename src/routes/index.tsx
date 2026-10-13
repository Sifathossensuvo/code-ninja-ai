import { createFileRoute } from "@tanstack/react-router";
import { NinjaApp } from "@/components/ninja/app";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Code Ninja — AI Code Factory" },
      {
        name: "description",
        content: "Your AI-powered terminal for generating, explaining and fixing code.",
      },
      { property: "og:title", content: "The Code Ninja — AI Code Factory" },
      {
        property: "og:description",
        content: "Turn ideas into code in your personal ninja workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});
function Index() {
  return <NinjaApp />;
}
