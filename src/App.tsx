import { useState, useEffect, useRef } from "react";
import {
  ActiveTab,
  CourseNote,
  PastQuestionPaper,
  Flashcard,
  Course,
  UserProfile,
  CBTMode,
  Announcement,
} from "./types";
import {
  COURSES,
  INITIAL_NOTES,
  INITIAL_PAST_QUESTIONS,
  CURATED_DECKS,
  DEFAULT_USER,
  DEMO_USERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_USERS_ROSTER,
  buildGenericDeck,
} from "./data/mockData";
import { TopNav } from "./components/TopNav";
import { CourseHubDashboard } from "./components/CourseHubDashboard";
import { NotesView } from "./components/NotesView";
import { DeckStudyView } from "./components/DeckStudyView";
import { PastQuestionsView } from "./components/PastQuestionsView";
import { CourseCatalogView } from "./components/CourseCatalogView";
import { UploadNoteModal } from "./components/UploadNoteModal";
import { UploadPaperModal } from "./components/UploadPaperModal";
import { PaperPreviewModal } from "./components/PaperPreviewModal";
import { HelpShortcutsModal } from "./components/HelpShortcutsModal";
import { AuthModal } from "./components/AuthModal";
import { HandwrittenConverterModal } from "./components/HandwrittenConverterModal";
import { CBTQuizModal } from "./components/CBTQuizModal";
import { PracticalReportsModal } from "./components/PracticalReportsModal";
import { LandingAuthPage } from "./components/LandingAuthPage";
import { AdminUserProvisioningModal } from "./components/AdminUserProvisioningModal";
import { Check } from "lucide-react";

const LOGGED_OUT_GUEST: UserProfile = {
  id: "guest",
  name: "Scholar Guest",
  matricNo: "Guest",
  email: "guest@lucid.edu",
  department: "Software & Web Development",
  level: "HND 1 • 300 Level",
  avatarInitials: "LU",
  isLoggedIn: false,
  role: "student",
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [selectedCourse, setSelectedCourse] = useState<Course>(COURSES[0]); // AIT 311
  
  // User profile & auth state
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("lucid_user") || localStorage.getItem("olisedesk_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch {
        return LOGGED_OUT_GUEST;
      }
    }
    return LOGGED_OUT_GUEST;
  });
  const [isGuestExploring, setIsGuestExploring] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signin" | "signup">("signin");

  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem("lucid_announcements");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ANNOUNCEMENTS;
      }
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  // User accounts roster (Admin provisioned accounts & pre-registered accounts)
  const [usersRoster, setUsersRoster] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem("lucid_users_roster");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USERS_ROSTER;
      }
    }
    return INITIAL_USERS_ROSTER;
  });

  // Modals state
  const [showHandwrittenConverter, setShowHandwrittenConverter] = useState(false);
  const [showUserProvisioningModal, setShowUserProvisioningModal] = useState(false);
  const [cbtQuizState, setCbtQuizState] = useState<{ isOpen: boolean; course: Course; mode: CBTMode } | null>(null);
  const [practicalReportState, setPracticalReportState] = useState<{ isOpen: boolean; course: Course } | null>(null);
  
  // Dark mode toggle with persistence & html class sync
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("lucid_theme");
    if (saved) return saved === "dark";
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("lucid_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("lucid_theme", "light");
    }
  }, [isDarkMode]);

  const [notes, setNotes] = useState<CourseNote[]>(() => {
    const saved = localStorage.getItem("lucid_notes") || localStorage.getItem("olisedesk_notes");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_NOTES;
      }
    }
    return INITIAL_NOTES;
  });

  const [papers, setPapers] = useState<PastQuestionPaper[]>(() => {
    const saved = localStorage.getItem("lucid_papers") || localStorage.getItem("olisedesk_papers");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PAST_QUESTIONS;
      }
    }
    return INITIAL_PAST_QUESTIONS;
  });

  const [openNoteId, setOpenNoteId] = useState<string | null>(null);
  const [showUploadNote, setShowUploadNote] = useState(false);
  const [showUploadPaper, setShowUploadPaper] = useState(false);
  const [previewPaper, setPreviewPaper] = useState<PastQuestionPaper | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  // Active timers tracking
  const timers = useRef<NodeJS.Timeout[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("lucid_notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("lucid_papers", JSON.stringify(papers));
  }, [papers]);

  useEffect(() => {
    localStorage.setItem("lucid_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("lucid_announcements", JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem("lucid_users_roster", JSON.stringify(usersRoster));
  }, [usersRoster]);

  const handleProvisionUser = (newUser: UserProfile) => {
    setUsersRoster((prev) => [newUser, ...prev]);
    setDownloadToast(
      `Assigned ${newUser.name} as ${
        newUser.role === "admin" ? "Department Admin" : "Course Rep"
      } (ID: ${newUser.matricNo})`
    );
    setTimeout(() => setDownloadToast(null), 4000);
  };

  const handleRevokeUser = (userId: string) => {
    setUsersRoster((prev) => prev.filter((u) => u.id !== userId));
    setDownloadToast("User account access revoked from roster.");
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const handleAddAnnouncement = (newAnn: Announcement) => {
    setAnnouncements((prev) => [newAnn, ...prev]);
    setDownloadToast(`Published notice: ${newAnn.title}`);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsGuestExploring(false);
    localStorage.setItem("lucid_user", JSON.stringify(user));
    const roleLabel =
      user.role === "admin"
        ? "ADMINISTRATOR"
        : user.role === "courserep"
        ? "COURSE REPRESENTATIVE"
        : "SCHOLAR";
    setDownloadToast(`Welcome, ${user.name}! Signed in as ${roleLabel}`);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  const handleSignOut = () => {
    setCurrentUser(LOGGED_OUT_GUEST);
    setIsGuestExploring(false);
    localStorage.removeItem("lucid_user");
    setDownloadToast("Signed out. Welcome back to the Lucid landing portal!");
    setTimeout(() => setDownloadToast(null), 3000);
  };

  // Check health endpoint for Gemini configuration
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hasGeminiKey) {
          setHasGeminiKey(true);
        }
      })
      .catch(() => {
        // Dev server or client-only fallback
      });

    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  // Flashcard Generation Pipeline
  const runGeneration = async (
    id: string,
    courseCode: string,
    noteTitle: string,
    rawText?: string
  ) => {
    // 1. Transition to PROCESSING
    const t1 = setTimeout(() => {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "PROCESSING" } : n))
      );
    }, 800);
    timers.current.push(t1);

    const courseObj = COURSES.find((c) => c.code === courseCode);
    const courseTitle = courseObj ? courseObj.title : "";

    // 2. Call the server API for real Gemini flashcards
    try {
      const response = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseCode,
          courseTitle,
          noteTitle,
          noteContent: rawText || "",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.cards) && data.cards.length > 0) {
          const t2 = setTimeout(() => {
            setNotes((prev) =>
              prev.map((n) =>
                n.id === id
                  ? {
                      ...n,
                      status: "READY",
                      deck: data.cards,
                      cardCount: data.cards.length,
                    }
                  : n
              )
            );
          }, 1800);
          timers.current.push(t2);
          return;
        }
      }
    } catch (err) {
      console.warn("Server generation failed, using client engine:", err);
    }

    // Client fallback generation
    const tFallback = setTimeout(() => {
      const fallbackDeck =
        CURATED_DECKS[courseCode] ||
        buildGenericDeck(COURSES.find((c) => c.code === courseCode));

      setNotes((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                status: "READY",
                deck: fallbackDeck,
                cardCount: fallbackDeck.length,
              }
            : n
        )
      );
    }, 2200);
    timers.current.push(tFallback);
  };

  // Upload note handler
  const handleUploadNote = ({
    course,
    title,
    fileName,
    rawText,
    sourceType,
  }: {
    course: string;
    title: string;
    fileName?: string;
    rawText?: string;
    sourceType: "file" | "paste" | "handwritten";
  }) => {
    const newId = `note-${Date.now()}`;
    const newNote: CourseNote = {
      id: newId,
      course,
      title,
      fileName,
      rawText,
      sourceType,
      uploadedAt: new Date().toISOString().slice(0, 10),
      status: "PENDING",
    };

    setNotes((prev) => [newNote, ...prev]);
    setShowUploadNote(false);
    runGeneration(newId, course, title, rawText);
  };

  // Handwritten note saved callback
  const handleHandwrittenNoteSaved = (savedNote: CourseNote) => {
    setNotes((prev) => [savedNote, ...prev]);
    setDownloadToast(`Saved handwritten note: ${savedNote.title}`);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  // Retry failed note
  const handleRetry = (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;

    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: "PENDING", error: undefined } : n
      )
    );
    runGeneration(id, note.course, note.title, note.rawText);
  };

  // Delete note
  const handleDeleteNote = (id: string) => {
    if (window.confirm("Are you sure you want to remove this course note?")) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (openNoteId === id) {
        setOpenNoteId(null);
      }
    }
  };

  // Upload paper handler
  const handleUploadPaper = ({
    course,
    session,
    examType,
    fileName,
  }: {
    course: string;
    session: string;
    examType: "First CA" | "Second CA" | "Final Exam";
    fileName: string;
  }) => {
    const newPaper: PastQuestionPaper = {
      id: `pq-${Date.now()}`,
      course,
      session,
      examType,
      fileName,
      fileSize: "1.9 MB",
      uploadedAt: new Date().toISOString().slice(0, 10),
      sampleQuestions: [
        `Question 1: Comprehensively analyze the principal methodologies tested in ${course} and discuss implementation constraints.`,
        `Question 2: State and prove the foundational theorem introduced in the ${session} academic session for ${course}.`,
      ],
    };

    setPapers((prev) => [newPaper, ...prev]);
    setShowUploadPaper(false);
  };

  // Download simulation
  const handleDownloadPaper = (paper: PastQuestionPaper) => {
    setDownloadToast(`Preparing ${paper.fileName} for download...`);
    setTimeout(() => {
      const textContent = `PAST EXAMINATION PAPER\nCourse: ${paper.course}\nSession: ${paper.session}\nExam Type: ${paper.examType}\nDate: ${paper.uploadedAt}\n\nQuestions:\n${(paper.sampleQuestions || []).join("\n\n")}`;
      const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = paper.fileName.replace(/\.pdf$/, ".txt");
      link.click();
      URL.revokeObjectURL(url);
      setDownloadToast(`Downloaded ${paper.fileName}`);
      setTimeout(() => setDownloadToast(null), 3000);
    }, 600);
  };

  const handleStartStudyForCourse = (courseCode: string) => {
    const matchingNote = notes.find((n) => n.course === courseCode && n.status === "READY");
    if (matchingNote) {
      setOpenNoteId(matchingNote.id);
      setActiveTab("notes");
    } else {
      // Find course and create on-the-fly deck
      const c = COURSES.find((item) => item.code === courseCode);
      const deck = CURATED_DECKS[courseCode] || buildGenericDeck(c);
      const instantNote: CourseNote = {
        id: `note-instant-${Date.now()}`,
        course: courseCode,
        title: `${courseCode}: ${c?.title || "Key Concepts"} Deck`,
        uploadedAt: new Date().toISOString().slice(0, 10),
        status: "READY",
        cardCount: deck.length,
        deck,
        fileName: `${courseCode}_curated_syllabus.pdf`,
        sourceType: "file",
      };
      setNotes((prev) => [instantNote, ...prev]);
      setOpenNoteId(instantNote.id);
      setActiveTab("notes");
    }
  };

  const openNote = notes.find((n) => n.id === openNoteId);

  // If user is logged out and not exploring as guest, show the unified Landing / Sign In / Sign Up page
  if (!currentUser.isLoggedIn && !isGuestExploring) {
    return (
      <LandingAuthPage
        onLogin={handleLoginSuccess}
        onExploreAsGuest={() => setIsGuestExploring(true)}
        usersRoster={usersRoster}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#0a0f1d] text-slate-100" : "bg-[#faf9f6] text-neutral-900"} flex flex-col transition-colors duration-200`}>
      {/* Top Navigation */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setOpenNoteId(null);
        }}
        notesCount={notes.length}
        papersCount={papers.length}
        coursesCount={COURSES.length}
        onUploadNoteClick={() => setShowUploadNote(true)}
        onUploadPaperClick={() => setShowUploadPaper(true)}
        onOpenHandwrittenConverter={() => setShowHandwrittenConverter(true)}
        onOpenAuth={() => {
          setAuthModalMode("signin");
          setIsAuthModalOpen(true);
        }}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main Content Areas */}
      <div className="flex-1">
        {/* Course Hub Primary Dashboard matching the user's screenshot */}
        {activeTab === "dashboard" && (
          <CourseHubDashboard
            courses={COURSES}
            activeCourse={selectedCourse}
            onSelectCourse={(course) => setSelectedCourse(course)}
            onStartStudy={handleStartStudyForCourse}
            onOpenCBTQuiz={(course, mode) => setCbtQuizState({ isOpen: true, course, mode })}
            onOpenPracticalReports={(course) => setPracticalReportState({ isOpen: true, course })}
            onOpenHandwrittenConverter={() => setShowHandwrittenConverter(true)}
            onUploadNoteClick={() => setShowUploadNote(true)}
            notes={notes}
            currentUser={currentUser}
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            onOpenUserProvisioning={() => setShowUserProvisioningModal(true)}
          />
        )}

        {/* Flashcard Study Deck View */}
        {activeTab === "notes" && openNoteId && openNote ? (
          <DeckStudyView
            note={openNote}
            onBack={() => setOpenNoteId(null)}
          />
        ) : null}

        {/* Notes & Flashcard Decks List */}
        {activeTab === "notes" && !openNoteId ? (
          <NotesView
            notes={notes}
            courses={COURSES}
            onUploadClick={() => setShowUploadNote(true)}
            onOpenDeck={(note) => setOpenNoteId(note.id)}
            onRetry={handleRetry}
            onDeleteNote={handleDeleteNote}
          />
        ) : null}

        {/* Past Questions Repository */}
        {activeTab === "past" ? (
          <PastQuestionsView
            papers={papers}
            courses={COURSES}
            onUploadClick={() => setShowUploadPaper(true)}
            onPreviewPaper={(paper) => setPreviewPaper(paper)}
            onDownloadPaper={handleDownloadPaper}
          />
        ) : null}

        {/* Course Catalog View */}
        {activeTab === "courses" ? (
          <CourseCatalogView
            courses={COURSES}
            notes={notes}
            papers={papers}
            onSelectCourseForNotes={(code) => {
              const matched = COURSES.find((c) => c.code === code);
              if (matched) setSelectedCourse(matched);
              setActiveTab("dashboard");
            }}
            onSelectCourseForPapers={(code) => {
              setActiveTab("past");
            }}
          />
        ) : null}
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-200/60 py-6 px-4 text-center text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-neutral-600">
            <span className="font-bold text-[#006d64]">Lucid</span>
            <span>•</span>
            <span className="text-[11px] text-neutral-400">
              Departmental Course Hub, Handwritten OCR & CBT Exam Simulation
            </span>
          </div>
          <div className="flex items-center gap-4 text-neutral-500">
            <button
              onClick={() => {
                setAuthModalMode("signin");
                setIsAuthModalOpen(true);
              }}
              className="hover:text-neutral-900 transition-colors"
            >
              Scholar Sign In / Sign Up
            </button>
            <span>•</span>
            <button
              onClick={() => setShowHandwrittenConverter(true)}
              className="text-[#006d64] font-semibold hover:underline"
            >
              ✍️ Handwritten OCR
            </button>
            <span>•</span>
            <button
              onClick={() => setShowHelpModal(true)}
              className="hover:text-neutral-900 transition-colors"
            >
              Shortcuts & Guide
            </button>
            <span>•</span>
            <button
              onClick={() => {
                if (window.confirm("Reset all notes, papers, and demo state?")) {
                  localStorage.removeItem("olisedesk_notes");
                  localStorage.removeItem("olisedesk_papers");
                  localStorage.removeItem("olisedesk_user");
                  setNotes(INITIAL_NOTES);
                  setPapers(INITIAL_PAST_QUESTIONS);
                  setCurrentUser(DEFAULT_USER);
                  setOpenNoteId(null);
                }
              }}
              className="hover:text-neutral-900 transition-colors"
            >
              Reset State
            </button>
          </div>
        </div>
      </footer>

      {/* Authentication Modal (Sign In & Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        usersRoster={usersRoster}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          handleLoginSuccess(user);
          setIsAuthModalOpen(false);
        }}
      />

      {/* Admin User Provisioning Modal (Admin Exclusive) */}
      <AdminUserProvisioningModal
        isOpen={showUserProvisioningModal}
        onClose={() => setShowUserProvisioningModal(false)}
        currentUser={currentUser}
        courses={COURSES}
        usersRoster={usersRoster}
        onProvisionUser={handleProvisionUser}
        onRevokeUser={handleRevokeUser}
      />

      {/* Handwritten Note Converter & Camera Modal */}
      {showHandwrittenConverter && (
        <HandwrittenConverterModal
          courses={COURSES}
          activeCourseCode={selectedCourse.code}
          onClose={() => setShowHandwrittenConverter(false)}
          onSavedNote={handleHandwrittenNoteSaved}
        />
      )}

      {/* CBT Quiz Modal (Objective, German with Penalty, Theory) */}
      {cbtQuizState?.isOpen && (
        <CBTQuizModal
          course={cbtQuizState.course}
          initialMode={cbtQuizState.mode}
          onClose={() => setCbtQuizState(null)}
        />
      )}

      {/* Practical Reports Modal */}
      {practicalReportState?.isOpen && (
        <PracticalReportsModal
          course={practicalReportState.course}
          onClose={() => setPracticalReportState(null)}
        />
      )}

      {/* Upload Note Modal */}
      {showUploadNote && (
        <UploadNoteModal
          courses={COURSES}
          onClose={() => setShowUploadNote(false)}
          onOpenHandwritten={() => setShowHandwrittenConverter(true)}
          onSubmit={handleUploadNote}
        />
      )}

      {/* Upload Paper Modal */}
      {showUploadPaper && (
        <UploadPaperModal
          courses={COURSES}
          onClose={() => setShowUploadPaper(false)}
          onSubmit={handleUploadPaper}
        />
      )}

      {/* Paper Preview Modal */}
      <PaperPreviewModal
        paper={previewPaper}
        onClose={() => setPreviewPaper(null)}
        onDownload={handleDownloadPaper}
      />

      {/* Help & Shortcuts Modal */}
      {showHelpModal && (
        <HelpShortcutsModal onClose={() => setShowHelpModal(false)} />
      )}

      {/* Toast Notification */}
      {downloadToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold shadow-lg border border-neutral-800 animate-slide-up">
          <Check size={14} className="text-emerald-400" />
          <span>{downloadToast}</span>
        </div>
      )}
    </div>
  );
}
