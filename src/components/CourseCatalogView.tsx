import { Course, CourseNote, PastQuestionPaper } from "../types";
import { BookOpen, FileText, GraduationCap, ArrowRight, Layers } from "lucide-react";

interface CourseCatalogViewProps {
  courses: Course[];
  notes: CourseNote[];
  papers: PastQuestionPaper[];
  onSelectCourseForNotes: (courseCode: string) => void;
  onSelectCourseForPapers: (courseCode: string) => void;
}

export function CourseCatalogView({
  courses,
  notes,
  papers,
  onSelectCourseForNotes,
  onSelectCourseForPapers,
}: CourseCatalogViewProps) {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="pb-6 mb-8 border-b border-neutral-200/80 dark:border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-300 mb-2">
          <BookOpen size={13} className="text-blue-600 dark:text-blue-400" />
          Curriculum Overview
        </div>
        <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
          Course Catalog & Syllabi
        </h1>
        <p className="text-sm text-neutral-500 dark:text-slate-400 mt-1 max-w-xl">
          All currently registered academic courses with associated study flashcards and past examination archives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {courses.map((course) => {
          const courseNotes = notes.filter((n) => n.course === course.code);
          const coursePapers = papers.filter((p) => p.course === course.code);
          const totalCards = courseNotes
            .filter((n) => n.status === "READY")
            .reduce((acc, curr) => acc + (curr.cardCount || 0), 0);

          return (
            <div
              key={course.code}
              className="bg-white dark:bg-slate-900 border border-neutral-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-neutral-900 dark:text-slate-100 px-2.5 py-1 bg-neutral-100 dark:bg-slate-800 rounded-lg border border-neutral-200 dark:border-slate-700">
                    {course.code}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-slate-400 font-medium">
                    {course.department}
                  </span>
                </div>

                <h3 className="font-serif-display text-lg font-bold text-neutral-900 dark:text-white mb-2">
                  {course.title}
                </h3>

                <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-xl bg-neutral-50/80 dark:bg-slate-800/80 border border-neutral-200/60 dark:border-slate-700 my-4 text-center">
                  <div>
                    <span className="block text-base font-bold text-neutral-900 dark:text-white">{courseNotes.length}</span>
                    <span className="text-[10px] text-neutral-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Notes</span>
                  </div>
                  <div>
                    <span className="block text-base font-bold text-neutral-900 dark:text-white">{totalCards}</span>
                    <span className="text-[10px] text-neutral-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Cards</span>
                  </div>
                  <div>
                    <span className="block text-base font-bold text-neutral-900 dark:text-white">{coursePapers.length}</span>
                    <span className="text-[10px] text-neutral-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Papers</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectCourseForNotes(course.code)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-slate-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  <FileText size={13} className="text-blue-600 dark:text-teal-400" />
                  <span>View Notes ({courseNotes.length})</span>
                  <ArrowRight size={12} />
                </button>

                <button
                  onClick={() => onSelectCourseForPapers(course.code)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-slate-300 hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  <GraduationCap size={14} className="text-neutral-500 dark:text-slate-400" />
                  <span>Past Papers ({coursePapers.length})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
