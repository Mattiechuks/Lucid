import { useState, useEffect } from "react";
import {
  X,
  Clock,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Award,
} from "lucide-react";
import { CBTMode, CBTQuestion, Course } from "../types";
import { CBT_QUESTION_BANK } from "../data/mockData";

interface CBTQuizModalProps {
  course: Course;
  initialMode: CBTMode;
  onClose: () => void;
}

export function CBTQuizModal({ course, initialMode, onClose }: CBTQuizModalProps) {
  const [mode, setMode] = useState<CBTMode>(initialMode);
  const questions: CBTQuestion[] = CBT_QUESTION_BANK[course.code] || CBT_QUESTION_BANK["AIT 311"] || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [germanAnswers, setGermanAnswers] = useState<Record<number, boolean>>({});
  const [theoryAnswers, setTheoryAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes timer

  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const currentQ = questions[currentIndex] || questions[0];

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  // Score calculation
  let score = 0;
  let totalPossible = questions.length;

  if (mode === "objective") {
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });
  } else if (mode === "german") {
    questions.forEach((q, idx) => {
      const userAns = germanAnswers[idx];
      if (userAns !== undefined) {
        if (userAns === q.germanCorrectBool) {
          score += 1;
        } else {
          score -= (q.germanPenalty || 0.5); // Penalty rule!
        }
      }
    });
  } else {
    // Theory mode self-assessment
    score = questions.length * 8; // out of 10
  }

  const handleReset = () => {
    setSelectedAnswers({});
    setGermanAnswers({});
    setTheoryAnswers({});
    setIsSubmitted(false);
    setCurrentIndex(0);
    setTimeLeft(300);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/70 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-2xl border border-neutral-200/90 shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#121526] px-6 py-4 text-white flex items-center justify-between border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-purple-300">
                EXAM SIMULATION • {course.code}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 font-medium">
                {mode === "objective" ? "Objective (MCQ)" : mode === "german" ? "German (Penalty)" : "Theory"}
              </span>
            </div>
            <h2 className="font-bold text-base sm:text-lg text-white">
              CBT Practice Test — {course.title}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {!isSubmitted && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-amber-300 text-xs font-mono font-bold">
                <Clock size={14} />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-6 pt-3 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setMode("objective");
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-t-lg text-xs font-semibold border-b-2 transition-all ${
                mode === "objective"
                  ? "border-[#006d64] text-[#006d64] bg-white font-bold"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              Objective (MCQ)
            </button>
            <button
              onClick={() => {
                setMode("german");
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-t-lg text-xs font-semibold border-b-2 transition-all ${
                mode === "german"
                  ? "border-amber-600 text-amber-700 bg-white font-bold"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              German (With Penalty)
            </button>
            <button
              onClick={() => {
                setMode("theory");
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-t-lg text-xs font-semibold border-b-2 transition-all ${
                mode === "theory"
                  ? "border-indigo-600 text-indigo-700 bg-white font-bold"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              Theory (Full Essays)
            </button>
          </div>

          <span className="text-[11px] text-neutral-500 font-medium">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Quiz Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!isSubmitted ? (
            <div className="space-y-6">
              {/* Question Text */}
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Question {currentIndex + 1}
                </span>
                <p className="text-sm font-semibold text-neutral-900 leading-relaxed">
                  {currentQ?.question}
                </p>
                {mode === "german" && (
                  <p className="text-[11px] text-amber-700 mt-2 font-medium bg-amber-50 p-2 rounded border border-amber-200/60">
                    ⚠️ German-style penalty: Correct answer = +1.0 point. Incorrect answer = -0.5 penalty. Leaving blank = 0 points.
                  </p>
                )}
              </div>

              {/* Answers based on Mode */}
              {mode === "objective" && (
                <div className="space-y-2.5">
                  {currentQ?.options?.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optIdx }))}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center gap-3 ${
                          isSelected
                            ? "border-[#006d64] bg-[#006d64]/5 text-[#006d64] font-semibold"
                            : "border-neutral-200 hover:bg-neutral-50 text-neutral-800"
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                            isSelected ? "border-[#006d64] bg-[#006d64] text-white" : "border-neutral-300 text-neutral-500"
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {mode === "german" && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setGermanAnswers((prev) => ({ ...prev, [currentIndex]: true }))}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      germanAnswers[currentIndex] === true
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-bold"
                        : "border-neutral-200 hover:bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    <span className="block text-base mb-1">✅</span>
                    <span className="text-xs">Statement is TRUE</span>
                  </button>
                  <button
                    onClick={() => setGermanAnswers((prev) => ({ ...prev, [currentIndex]: false }))}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      germanAnswers[currentIndex] === false
                        ? "border-rose-600 bg-rose-50 text-rose-900 font-bold"
                        : "border-neutral-200 hover:bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    <span className="block text-base mb-1">❌</span>
                    <span className="text-xs">Statement is FALSE</span>
                  </button>
                </div>
              )}

              {mode === "theory" && (
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-neutral-700">
                    Your Essay Answer & Derivations:
                  </label>
                  <textarea
                    rows={5}
                    value={theoryAnswers[currentIndex] || ""}
                    onChange={(e) => setTheoryAnswers((prev) => ({ ...prev, [currentIndex]: e.target.value }))}
                    placeholder="Type your comprehensive essay response, steps, definitions, and code syntax here..."
                    className="w-full p-3 rounded-xl border border-neutral-200 text-xs text-neutral-900 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 text-[11px] text-indigo-900">
                    <span className="font-bold">Key marking criteria:</span> Clarity of definition, correct mathematical proof or notation, and handling of edge-cases.
                  </div>
                </div>
              )}

              {/* Navigation pagination */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  className="px-3.5 py-1.5 rounded-lg border border-neutral-200 text-neutral-700 text-xs font-semibold disabled:opacity-40"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold ${
                        currentIndex === i
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="px-3.5 py-1.5 rounded-lg bg-[#006d64] text-white text-xs font-semibold"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={() => setIsSubmitted(true)}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                  >
                    Submit Test
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Result Breakdown */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 border border-emerald-200">
                <Award size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900">Test Complete!</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Here is your performance report for {course.code} ({mode.toUpperCase()} mode).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 max-w-sm mx-auto flex items-center justify-around">
                <div>
                  <span className="block text-2xl font-black text-neutral-900">
                    {Math.max(0, score).toFixed(1)} / {totalPossible}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-semibold">Final Score</span>
                </div>
                <div className="w-px h-10 bg-neutral-200" />
                <div>
                  <span className="block text-2xl font-black text-emerald-600">
                    {Math.round((Math.max(0, score) / totalPossible) * 100)}%
                  </span>
                  <span className="text-[11px] text-neutral-500 font-semibold">Grade</span>
                </div>
              </div>

              {/* Answers Review */}
              <div className="text-left space-y-3 max-h-64 overflow-y-auto">
                <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Detailed Answer Review:
                </h4>
                {questions.map((q, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-neutral-200 bg-white text-xs">
                    <p className="font-bold text-neutral-900 mb-1">
                      {idx + 1}. {q.question}
                    </p>
                    <p className="text-neutral-600 text-[11px] mb-1.5">
                      <span className="font-semibold text-[#006d64]">Explanation:</span> {q.explanation}
                    </p>
                    {mode === "theory" && q.theoryAnswer && (
                      <div className="mt-2 p-2 rounded bg-indigo-50 text-indigo-900 text-[11px]">
                        <span className="font-bold">Model Theory Solution:</span> {q.theoryAnswer}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold flex items-center gap-1.5"
                >
                  <RotateCcw size={14} />
                  <span>Retake Test</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-[#006d64] hover:bg-[#005851] text-white text-xs font-bold shadow-xs"
                >
                  Back to Course
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
