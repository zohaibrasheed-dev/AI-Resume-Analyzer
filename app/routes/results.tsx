import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";

export const meta = () => ([
    { title: 'Resumind | Results ' },
    { name: 'description', content: 'Detailed overview of your resume' },
])

const Results = () => {
    return (
        <main className="!pt-0">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
                    <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                        <a href="#" target="_blank" rel="noopener noreferrer">
                            <img src="" className="w-full h-full object-contain rounded-2xl" title="resume" />
                        </a>
                    </div>
                </section>
                <section className="feedback-section">
                    <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                    <h2>Feedback Goes here</h2>
                </section>
            </div>
        </main>
    )
}

export default Results