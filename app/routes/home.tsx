import Hero from "~/components/Hero";
import type { Route } from "./+types/home";
import Header from "~/components/Header";
import ResumesArea from "~/components/ResumesArea";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "AI Resume Analyzer" },
    { name: "description", content: "Welcome to the AI Resume Analyzer!" },
  ];
}

export default function Home() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if ((window as any).puter) { // check if puter is installed!
      const puter = (window as any).puter;

      // check if user loggedIn OR not
      if (puter.auth.isSignedIn()) {
        setLoading(false);
      } else {
        navigate('/auth?next=/');
      }

    }
  }, [])


  return (

    <>

      {
        loading ? (
          <main className="loader min-h-screen flex items-center justify-center">
            <span className="text-3xl font-bold">Loading....</span>
          </main>
        ) : (
          <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Header />
            <Hero />
            <ResumesArea />
          </main>
        )
      }

    </>

  )
}