export type GenerationStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";

export interface Flashcard {
  id?: string;
  q: string;
  a: string;
  starred?: boolean;
}

export interface Course {
  code: string;
  title: string;
  department?: string;
  color?: string;
  level?: string;
  starred?: boolean;
  units?: number;
  semester?: string;
  description?: string;
  isCompulsory?: boolean;
  flashcardCount?: number;
  practicalCount?: number;
  topics?: string[];
}

export interface CBTQuestion {
  id?: string;
  question: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
  // German style specific
  isGermanTrueFalse?: boolean;
  germanCorrectBool?: boolean;
  germanPenalty?: number; // e.g. -0.5 points for wrong guess
  // Theory specific
  theoryAnswer?: string;
  points?: number;
}

export interface CourseNote {
  id: string;
  course: string;
  title: string;
  uploadedAt: string;
  status: GenerationStatus;
  cardCount?: number;
  deck?: Flashcard[];
  error?: string;
  fileName?: string;
  rawText?: string;
  sourceType?: "file" | "paste" | "handwritten";
  isHandwritten?: boolean;
  imageUrl?: string;
  transcription?: string;
  summary?: string;
  cbtQuestions?: CBTQuestion[];
}

export interface PastQuestionPaper {
  id: string;
  course: string;
  session: string;
  examType: "First CA" | "Second CA" | "Final Exam";
  uploadedAt: string;
  fileName: string;
  fileSize?: string;
  sampleQuestions?: string[];
}

export interface PracticalReport {
  id: string;
  course: string;
  title: string;
  weekNumber: number;
  aim: string;
  apparatus: string[];
  procedure: string[];
  observations: string;
  conclusions: string;
  date: string;
}

export type UserRole = "student" | "courserep" | "admin";

export interface Announcement {
  id: string;
  authorName: string;
  authorRole: UserRole;
  title: string;
  content: string;
  courseCode?: string;
  date: string;
  pinned?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  matricNo: string;
  email: string;
  department: string;
  level: string;
  avatarInitials: string;
  isLoggedIn: boolean;
  role: UserRole;
  repCourseCode?: string;
  staffTitle?: string;
  assignedBy?: string;
  assignedAt?: string;
  password?: string;
}

export type ActiveTab = "dashboard" | "notes" | "past" | "courses" | "cbt" | "practicals" | "admin";
export type CBTMode = "objective" | "german" | "theory";

