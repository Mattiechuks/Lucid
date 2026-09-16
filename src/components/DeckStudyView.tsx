import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Shuffle,
  Star,
  Download,
  Share2,
  Layers,
  Keyboard,
} from "lucide-react";
import { CourseNote, Flashcard } from "../types";

interface DeckStudyViewProps {
  note: CourseNote;
  onBack: () => void;
}

export function DeckStudyView({ note, onBack }: DeckStudyViewProps) {
  const initialCards = useMemo(() => note.deck || [], [note.deck]);

  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  // Record result per card: 'got-it' | 'review'
  const [results, setResults] = useState<{ [cardIndex: number]: "got-it" | "review" }>({});
  const [starredCards, setStarredCards] = useState<Set<number>>(new Set());
  const [studyModeFilter, setStudyModeFilter] = useState<"all" | "missed">("all");
  const [copiedToast, setCopiedToast] = useState(false);

  const activeDeck = cards;
  const currentCard = activeDeck[index];
  const isFinished = activeDeck.length > 0 && index >= activeDeck.length;

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isFinished) return;

      // Flip card on Space
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      }
      // Rating with 1 and 2 or ArrowLeft / ArrowRight
      else if (isFlipped) {
        if (e.key === "1" || e.key === "ArrowLeft") {
          e.preventDefault();
          handleRate("review");
        } else if (e.key === "2" || e.key === "ArrowRight") {
          e.preventDefault();
          handleRate("got-it");
        }
      }
      // Star toggle with 's' or 'S'
      if (e.key === "s" || e.key === "S") {
        toggleStar(index);
      }
      // Escape to back
      if (e.key === "Escape") {
        onBack();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, index, isFinished, activeDeck.length]);

  const handleRate = (result: "got-it" | "review") => {
    setResults((prev) => ({ ...prev, [index]: result }));
    setIsFlipped(false);
    setIndex((prev) => prev + 1);
  };

  const handleRestart = (onlyMissed = false) => {
    if (onlyMissed) {
      const missedIndices = Object.entries(results)
        .filter(([_, res]) => res === "review")
        .map(([idx]) => Number(idx));
      const missedCards = initialCards.filter((_, idx) => missedIndices.includes(idx));
      if (missedCards.length > 0) {
        setCards(missedCards);
        setStudyModeFilter("missed");
      }
    } else {
      setCards(initialCards);
      setStudyModeFilter("all");
    }
    setIndex(0);
    setIsFlipped(false);
    setResults({});
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setIndex(0);
    setIsFlipped(false);
    setResults({});
  };

  const toggleStar = (cardIdx: number) => {
    setStarredCards((prev) => {
      const next = new Set(prev);
      if (next.has(cardIdx)) {
        next.delete(cardIdx);
      } else {
        next.add(cardIdx);
      }
      return next;
    });
  };

  const exportDeckAsMarkdown = () => {
    const content = cards
      .map((c, i) => `### Card ${i + 1}\n**Q:** ${c.q}\n\n**A:** ${c.a}\n`)
      .join("\n---\n\n");
    const blob = new Blob([`# ${note.course} — ${note.title}\n\n${content}`], {
      type: "text/markdown;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${note.course.replace(/\s+/g, "_")}_Deck.md`;
    link.click();
    URL.revokeObjectURL(url);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2400);
  };

  // Completion Screen
  if (isFinished) {
    const total = activeDeck.length;
    const gotItCount = Object.values(results).filter((r) => r === "got-it").length;
    const reviewCount = Object.values(results).filter((r) => r === "review").length;
    const masteryPercentage = total > 0 ? Math.round((gotItCount / total) * 100) : 0;

    return (
      <main className="max-w-2xl mx-auto px-4 py-12">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          <span>Back to all notes</span>
        </button>

        <div className="bg-white border border-neutral-200/90 rounded-2xl p-8 sm:p-10 shadow-xs text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-5">
            <CheckCircle2 size={30} />
          </div>

          <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
            Deck Completed
          </h1>
          <p className="text-sm text-neutral-500 max-w-md mx-auto mb-8">
            You reviewed {total} cards for <span className="font-semibold text-neutral-800">{note.course}</span> — {note.title}.
          </p>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <span className="block text-2xl font-bold text-neutral-900">{masteryPercentage}%</span>
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Mastery</span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/60">
              <span className="block text-2xl font-bold text-emerald-700">{gotItCount}</span>
              <span className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider">Got It</span>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200/60">
              <span className="block text-2xl font-bold text-amber-700">{reviewCount}</span>
              <span className="text-[11px] font-medium text-amber-600 uppercase tracking-wider">Needs Review</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {reviewCount > 0 && (
              <button
                onClick={() => handleRestart(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-all"
              >
                <RotateCcw size={14} />
                <span>Review Missed Cards ({reviewCount})</span>
              </button>
            )}

            <button
              onClick={() => handleRestart(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold border border-neutral-200 transition-colors"
            >
              <RotateCcw size={14} />
              <span>Study All Cards Again</span>
            </button>

            <button
              onClick={exportDeckAsMarkdown}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold border border-neutral-200 transition-colors"
            >
              <Download size={14} />
              <span>Export Markdown</span>
            </button>
          </div>

          {copiedToast && (
            <p className="mt-4 text-xs text-emerald-600 font-medium animate-fade-in">
              Deck downloaded successfully!
            </p>
          )}
        </div>
      </main>
    );
  }

  if (!currentCard) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-neutral-500 mb-4">No cards found in this deck.</p>
        <button onClick={onBack} className="text-xs font-semibold text-blue-600 underline">
          Return to notes
        </button>
      </div>
    );
  }

  const isStarred = starredCards.has(index);
  const progressPercent = Math.round(((index + 1) / activeDeck.length) * 100);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-950 transition-colors group"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          <span>Back to notes</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleStar(index)}
            title={isStarred ? "Card Starred" : "Star this card for later"}
            className={`p-2 rounded-lg border transition-colors ${
              isStarred
                ? "bg-amber-50 border-amber-300 text-amber-500"
                : "bg-white border-neutral-200 text-neutral-400 hover:text-neutral-700"
            }`}
          >
            <Star size={15} className={isStarred ? "fill-amber-400" : ""} />
          </button>

          <button
            onClick={handleShuffle}
            title="Shuffle Deck"
            className="p-2 rounded-lg bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <Shuffle size={15} />
          </button>
        </div>
      </div>

      {/* Course & Note Title */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="inline-block text-[11px] font-bold tracking-wide text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50">
            {note.course}
          </span>
          {studyModeFilter === "missed" && (
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Focusing on Missed Cards
            </span>
          )}
        </div>
        <h2 className="text-base sm:text-lg font-bold text-neutral-900">
          {note.title}
        </h2>
      </div>

      {/* Progress Bar & Counter */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 bg-neutral-200/70 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-900 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-neutral-500 tabular-nums">
          {index + 1} / {activeDeck.length}
        </span>
      </div>

      {/* Interactive 3D Flashcard Container */}
      <div className="perspective-1000 mb-6">
        <div
          onClick={() => setIsFlipped((f) => !f)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setIsFlipped((f) => !f)}
          className={`relative w-full min-h-[300px] sm:min-h-[340px] rounded-2xl border transition-all duration-500 transform-style-3d cursor-pointer select-none shadow-xs hover:shadow-md ${
            isFlipped
              ? "rotate-y-180 border-blue-200 bg-white"
              : "border-neutral-200/90 bg-white hover:border-neutral-300"
          }`}
        >
          {/* Front Face: Question */}
          <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-between backface-hidden">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-400 uppercase tracking-widest text-[10px]">
                Question {index + 1}
              </span>
              <span className="text-neutral-400 text-[11px]">Click or press Space</span>
            </div>

            <div className="my-auto py-4">
              <p className="font-serif-display text-xl sm:text-2xl text-neutral-900 leading-relaxed font-semibold">
                {currentCard.q}
              </p>
            </div>

            <div className="text-center pt-2 border-t border-neutral-100">
              <span className="text-xs font-medium text-blue-600 hover:text-blue-700">
                Click to reveal answer →
              </span>
            </div>
          </div>

          {/* Back Face: Answer */}
          <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-between rotate-y-180 backface-hidden bg-neutral-50/50">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-blue-600 uppercase tracking-widest text-[10px]">
                Answer
              </span>
              <span className="text-neutral-400 text-[11px]">Card {index + 1} of {activeDeck.length}</span>
            </div>

            <div className="my-auto py-4">
              <p className="text-neutral-800 text-base sm:text-lg leading-relaxed font-normal">
                {currentCard.a}
              </p>
            </div>

            <div className="text-center pt-2 border-t border-neutral-200/60">
              <span className="text-xs font-medium text-neutral-500">
                Rate your recall below to advance
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Controls (Shown when card is flipped) */}
      <div className="min-h-[52px] flex items-center justify-center">
        {isFlipped ? (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => handleRate("review")}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 font-semibold text-xs transition-all active:scale-[0.98]"
            >
              <ThumbsDown size={14} className="text-amber-500" />
              <span>Review Again</span>
              <span className="hidden sm:inline text-[10px] text-neutral-400 font-mono">(1 or ←)</span>
            </button>

            <button
              onClick={() => handleRate("got-it")}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs shadow-xs transition-all active:scale-[0.98]"
            >
              <ThumbsUp size={14} className="text-emerald-400" />
              <span>Got It</span>
              <span className="hidden sm:inline text-[10px] text-neutral-400 font-mono">(2 or →)</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-neutral-400 text-xs font-medium">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 font-mono text-[10px] text-neutral-600">
                Space
              </kbd>{" "}
              flip card
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 font-mono text-[10px] text-neutral-600">
                S
              </kbd>{" "}
              star
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 font-mono text-[10px] text-neutral-600">
                Esc
              </kbd>{" "}
              exit
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
