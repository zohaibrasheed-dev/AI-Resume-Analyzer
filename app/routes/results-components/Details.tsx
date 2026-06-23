import { cn } from "~/lib/utils";
import {
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionItem,
} from "./Accordion";

// ── Types ──────────────────────────────────────────────────────────────────
interface Tip {
    type: "good" | "improve";
    tip: string;
    explanation: string;
}

interface Category {
    score: number;
    tips: Tip[];
}

interface FeedbackData {
    overallScore: number;
    ATS?: Category;
    toneAndStyle?: Category;
    content?: Category;
    structure?: Category;
    skills?: Category;
}

// ── ScoreBadge ─────────────────────────────────────────────────────────────
const ScoreBadge = ({ score }: { score: number }) => {
    return (
        <div
            className={cn(
                "flex flex-row gap-1 items-center px-2 py-0.5 rounded-full",
                score > 69
                    ? "bg-badge-green"
                    : score > 39
                        ? "bg-badge-yellow"
                        : "bg-badge-red"
            )}
        >
            <img
                src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
                alt="score icon"
                className="size-4"
            />
            <p
                className={cn(
                    "text-sm font-medium",
                    score > 69
                        ? "text-badge-green-text"
                        : score > 39
                            ? "text-badge-yellow-text"
                            : "text-badge-red-text"
                )}
            >
                {score}/100
            </p>
        </div>
    );
};

// ── CategoryHeader ─────────────────────────────────────────────────────────
const CategoryHeader = ({
    title,
    categoryScore,
}: {
    title: string;
    categoryScore: number;
}) => {
    return (
        <div className="flex flex-row gap-3 items-center py-2">
            <p className="text-xl font-semibold text-gray-800">{title}</p>
            <ScoreBadge score={categoryScore} />
        </div>
    );
};

// ── CategoryContent ────────────────────────────────────────────────────────
const CategoryContent = ({ tips }: { tips: Tip[] }) => {
    if (!tips || tips.length === 0) return null;

    return (
        <div className="flex flex-col gap-4 w-full pb-2">
            {/* Quick overview grid */}
            <div className="bg-gray-50 w-full rounded-lg px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {tips.map((tip, index) => (
                    <div className="flex flex-row gap-2 items-center" key={index}>
                        <img
                            src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                            alt={tip.type}
                            className="size-4 shrink-0"
                        />
                        <p className="text-sm text-gray-600">{tip.tip}</p>
                    </div>
                ))}
            </div>

            {/* Detailed tip cards */}
            <div className="flex flex-col gap-3 w-full">
                {tips.map((tip, index) => (
                    <div
                        key={index + tip.tip}
                        className={cn(
                            "flex flex-col gap-1.5 rounded-2xl p-4",
                            tip.type === "good"
                                ? "bg-green-50 border border-green-200"
                                : "bg-yellow-50 border border-yellow-200"
                        )}
                    >
                        <div className="flex flex-row gap-2 items-center">
                            <img
                                src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                                alt={tip.type}
                                className="size-4 shrink-0"
                            />
                            <p
                                className={cn(
                                    "text-base font-semibold",
                                    tip.type === "good" ? "text-green-700" : "text-yellow-700"
                                )}
                            >
                                {tip.tip}
                            </p>
                        </div>
                        <p
                            className={cn(
                                "text-sm leading-relaxed pl-6",
                                tip.type === "good" ? "text-green-700" : "text-yellow-700"
                            )}
                        >
                            {tip.explanation}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── Details ────────────────────────────────────────────────────────────────
const Details = ({ feedback }: { feedback: FeedbackData }) => {
    // Build only the sections that actually have data
    const sections = [
        { id: "content",    title: "Content",     data: feedback?.content },
        { id: "skills",     title: "Skills",      data: feedback?.skills },
        { id: "tone-style", title: "Tone & Style", data: feedback?.toneAndStyle },
        { id: "structure",  title: "Structure",   data: feedback?.structure },
    ].filter((s) => s.data && s.data.score !== undefined);

    if (sections.length === 0) return null;

    return (
        <div className="flex flex-col gap-2 w-full">
            <Accordion allowMultiple>
                {sections.map(({ id, title, data }) => (
                    <AccordionItem key={id} id={id}>
                        <AccordionHeader itemId={id}>
                            <CategoryHeader title={title} categoryScore={data!.score} />
                        </AccordionHeader>
                        <AccordionContent itemId={id}>
                            <CategoryContent tips={data!.tips ?? []} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default Details;
