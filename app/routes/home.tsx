import Hero from "~/components/Hero";
import type { Route } from "./+types/home";
import Header from "~/components/Header";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI Resume Analyzer" },
    { name: "description", content: "Welcome to the AI Resume Analyzer!" },
  ];
}

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
    </main>
  )
}