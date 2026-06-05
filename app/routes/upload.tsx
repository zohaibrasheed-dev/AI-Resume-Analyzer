import Header from "~/components/Header";
import Hero from "./upload-components/Hero";
import ResumeForm from "./upload-components/ResumeForm";

const Upload = () => {

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Header />
            <Hero />
            <ResumeForm />
        </main>
    )
}

export default Upload