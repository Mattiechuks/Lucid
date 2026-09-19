export type GenerationStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";

export type InstitutionType = "university" | "polytechnic";

export interface DivisionStructure {
  name: string; // e.g. "School of Information & Comm. Tech" or "Faculty of Computing & Informatics"
  departments: string[];
}

export interface Institution {
  id: string;
  name: string;
  shortName: string;
  type: InstitutionType;
  divisionLabel: "Faculty" | "School" | "College"; // "Faculty" for University, "School" for Polytechnic, "College" for collegiate universities
  divisions: DivisionStructure[];
  supportedLevels: string[]; // Poly: ["ND 1", "ND 2", "HND 1", "HND 2"], Univ: ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"]
}

export interface Flashcard {
  id?: string;
  q: string;
  a: string;
  starred?: boolean;
}

export interface Course {
  code: string;
  title: string;
  institutionType?: InstitutionType;
  institutionId?: string; // e.g. "FEDPONEK", "UNILAG", "ALL"
  institutionName?: string;
  facultyOrSchool?: string;
  department?: string;
  level?: string; // e.g. "ND 1", "ND 2", "HND 1", "HND 2", "100 Level", "200 Level", "300 Level", "400 Level", "500 Level"
  color?: string;
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
  institutionType?: InstitutionType;
  institutionId?: string;
  institutionName?: string;
  facultyOrSchool?: string;
  department?: string;
  level?: string;
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
  uploadedByRole?: UserRole;
  uploadedByName?: string;
  authorId?: string;
  authorRole?: UserRole;
  authorName?: string;
  isRepVerified?: boolean;
}

export interface PastQuestionPaper {
  id: string;
  course: string;
  session: string;
  examType: "First CA" | "Second CA" | "Final Exam";
  uploadedAt: string;
  fileName: string;
  fileSize?: string;
  institutionType?: InstitutionType;
  institutionId?: string;
  institutionName?: string;
  facultyOrSchool?: string;
  department?: string;
  level?: string;
  sampleQuestions?: string[];
  uploadedByRole?: UserRole;
  uploadedByName?: string;
  authorId?: string;
  authorRole?: UserRole;
  authorName?: string;
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
  authorId?: string;
  authorName: string;
  authorRole: UserRole;
  title: string;
  content: string;
  courseCode?: string;
  institutionType?: InstitutionType;
  institutionId?: string;
  institutionName?: string;
  department?: string;
  level?: string;
  date: string;
  pinned?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  matricNo: string;
  email: string;
  institutionType?: InstitutionType;
  institutionId?: string;
  institutionName?: string;
  facultyOrSchool?: string;
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

export type ActiveTab = "dashboard" | "notes" | "past" | "courses" | "cbt" | "practicals" | "admin" | "analytics";
export type CBTMode = "objective" | "german" | "theory";

export interface QuizResult {
  id: string;
  userId: string;
  userName?: string;
  courseCode: string;
  courseTitle?: string;
  mode: CBTMode;
  score: number;
  total: number;
  percentage: number;
  durationSeconds: number;
  completedAt: string;
  institutionId?: string;
  department?: string;
  level?: string;
}

export interface UserAnalytics {
  userId: string;
  totalQuizzesTaken: number;
  averageScore: number;
  bestScore: number;
  currentStreakDays: number;
  lastActiveDate: string;
  notesStudiedCount: number;
  pastQuestionsViewedCount: number;
  history: QuizResult[];
}



