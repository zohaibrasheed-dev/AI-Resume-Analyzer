import { Accordion, AccordionContent } from "./Accordion";

const CategoryHeader = ({ title, score }: { title: string; score: number }) => (
    <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <span className="text-sm font-semibold bg-white px-2 py-1 rounded border">Score: {score}/100</span>
    </div>
);

const Details = ({ feedback }: { feedback: any }) => {
    const sections = [
        { key: "ATS", title: "ATS Compatibility" },
        { key: "toneAndStyle", title: "Tone & Style" },
        { key: "content", title: "Content Quality" },
        { key: "structure", title: "Structure" },
        { key: "skills", title: "Skills Analysis" },
    ];

    return (
        <div className="space-y-4">
            {sections.map((section) => {
                const data = feedback[section.key];
                if (!data) return null;

                return (
                    <div key={section.key} className="border rounded-lg shadow-sm bg-white overflow-hidden">
                        <Accordion>
                            <CategoryHeader title={section.title} score={data.score} />
                            <AccordionContent itemId={section.key}>
                                <div className="space-y-3 p-4">
                                    {data.tips.map((t: any, i: number) => (
                                        <div key={i} className="flex gap-3">
                                            <span className={t.type === "good" ? "text-green-500" : "text-amber-500"}>
                                                {t.type === "good" ? "✓" : "⚠"}
                                            </span>
                                            <div>
                                                <p className="font-medium text-gray-700">{t.tip}</p>
                                                {t.explanation && <p className="text-sm text-gray-500">{t.explanation}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </Accordion>
                    </div>
                );
            })}
        </div>
    );
};

export default Details;