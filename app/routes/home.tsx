import Hero from "~/components/Hero";
import type { Route } from "./+types/home";
import Header from "~/components/Header";
import ResumesArea from "~/components/ResumesArea";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI Resume Analyzer" },
    { name: "description", content: "Welcome to the AI Resume Analyzer!" },
  ];
}

export default function Home() {

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Header />
      <Hero />
      <ResumesArea />
    </main>
  )
}