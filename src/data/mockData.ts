import { Course, CourseNote, PastQuestionPaper, Flashcard, UserProfile, PracticalReport, CBTQuestion, Announcement } from "../types";

export const COURSES: Course[] = [
  { code: "SWD 311", title: "Operating System", department: "Software & Web Development", level: "300 Level", starred: true },
  { code: "SWD 312", title: "Database Design I", department: "Software & Web Development", level: "300 Level", starred: false },
  { code: "SWD 313", title: "C++ Programming", department: "Software & Web Development", level: "300 Level", starred: true },
  { code: "SWD 314", title: "Operation Research", department: "Software & Web Development", level: "300 Level", starred: false },
  { code: "SWD 315", title: "Data Comms & Network", department: "Software & Web Development", level: "300 Level", starred: false },
  { code: "SWD 316", title: "Intro to Software Engine...", department: "Software & Web Development", level: "300 Level", starred: false },
  { code: "AIT 311", title: "Computer Architecture", department: "Computer Science", level: "300 Level", starred: false },
  { code: "AIT 313", title: "Artificial Intelligence", department: "Computer Science", level: "300 Level", starred: false },
  { code: "GNS 303", title: "Use of English III", department: "General Studies", level: "300 Level", starred: false },
  { code: "PET 303", title: "Advance Petroleum Tech", department: "Petroleum Tech", level: "300 Level", starred: false },
  { code: "MTH 311", title: "Advance Algebra", department: "Mathematics", level: "300 Level", starred: false },
];

export const DEMO_USERS: Record<"student" | "courserep" | "admin", UserProfile> = {
  student: {
    id: "usr-student-1",
    name: "Kelechi Okafor",
    matricNo: "SWD/2023/1042",
    email: "chukwujimatthew5@gmail.com",
    department: "Software & Web Development",
    level: "HND 1 • 300 Level",
    avatarInitials: "KO",
    isLoggedIn: true,
    role: "student",
  },
  courserep: {
    id: "usr-rep-1",
    name: "Blessing Adeyemi",
    matricNo: "SWD/2023/0018",
    email: "rep.blessing@lucid.edu",
    department: "Software & Web Development",
    level: "HND 1 • 300 Level",
    avatarInitials: "BA",
    isLoggedIn: true,
    role: "courserep",
    repCourseCode: "SWD 311 (Operating System) & HND 1 Class Rep",
  },
  admin: {
    id: "usr-admin-1",
    name: "Dr. O. C. Eze",
    matricNo: "STAFF/ENG/049",
    email: "admin.hod@lucid.edu",
    department: "Software & Web Development / Computer Science",
    level: "Faculty Board • Exam Officer",
    avatarInitials: "DR",
    isLoggedIn: true,
    role: "admin",
    staffTitle: "Head of Department & Academic Coordinator",
  },
};

export const INITIAL_USERS_ROSTER: UserProfile[] = [
  DEMO_USERS.admin,
  DEMO_USERS.courserep,
  DEMO_USERS.student,
  {
    id: "usr-rep-2",
    name: "Emeka Nwankwo",
    matricNo: "SWD/2023/0045",
    email: "emeka.rep@lucid.edu",
    department: "Software & Web Development",
    level: "HND 1 • 300 Level",
    avatarInitials: "EN",
    isLoggedIn: false,
    role: "courserep",
    repCourseCode: "SWD 312 (Database Design I) Rep",
    assignedBy: "Dr. O. C. Eze (HOD)",
    assignedAt: "2026-09-02",
  },
  {
    id: "usr-admin-2",
    name: "Engr. Fatima Bello",
    matricNo: "STAFF/ENG/052",
    email: "f.bello@lucid.edu",
    department: "Computer Engineering / SWD",
    level: "Faculty Board",
    avatarInitials: "FB",
    isLoggedIn: false,
    role: "admin",
    staffTitle: "Sub-Dean & CBT Systems Officer",
    assignedBy: "Dr. O. C. Eze (HOD)",
    assignedAt: "2026-08-28",
  },
];

export const DEFAULT_USER: UserProfile = DEMO_USERS.student;

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    authorName: "Dr. O. C. Eze",
    authorRole: "admin",
    title: "Official CBT Mid-Semester Examination Timetable Published",
    content: "The departmental examination board has ratified the CBT schedule for SWD 311, AIT 311, and SWD 313. Tests will incorporate both Objective and German penalty (-0.5) scoring formats. Make sure your practice metrics are up to date.",
    date: "Today, 09:30 AM",
    pinned: true,
  },
  {
    id: "ann-2",
    authorName: "Blessing Adeyemi (Class Rep)",
    authorRole: "courserep",
    title: "SWD 312 Database Laboratory Report Submission Reminder",
    content: "Colleagues, kindly ensure your Week 3 ER Diagram practical laboratory write-ups are finalized. I have uploaded the approved template and past questions archive for our cohort in the hub.",
    courseCode: "SWD 312",
    date: "Yesterday",
    pinned: false,
  },
];

export const SESSIONS = ["2025/2026", "2024/2025", "2023/2024"];
export const EXAM_TYPES = ["First CA", "Second CA", "Final Exam"] as const;

export const CURATED_DECKS: Record<string, Flashcard[]> = {
  "AIT 311": [
    {
      id: "ca1",
      q: "What is the primary difference between Von Neumann and Harvard architecture?",
      a: "Von Neumann shares a single memory and bus for both code instructions and data, whereas Harvard has physically separated storage and signal pathways for instructions and data.",
    },
    {
      id: "ca2",
      q: "Explain pipeline stalling and name its main causes.",
      a: "A stall (bubble) is a delay introduced in instruction execution caused by structural hazards, data dependencies, or branch control hazards.",
    },
    {
      id: "ca3",
      q: "What is Amdahl's Law and what does it mathematically express?",
      a: "It models the theoretical speedup in latency of an execution task at fixed workload: S = 1 / ((1 - p) + (p / s)), showing speedup is fundamentally bounded by the non-parallelizable portion.",
    },
    {
      id: "ca4",
      q: "What is the function of the Program Counter (PC) register?",
      a: "The PC holds the memory address of the next machine instruction to be fetched, incrementing automatically after each instruction fetch cycle.",
    },
    {
      id: "ca5",
      q: "Contrast Write-Through vs. Write-Back caching strategies.",
      a: "Write-Through immediately writes data to both cache and main RAM. Write-Back writes only to cache, updating main memory only when dirty cache lines are evicted.",
    },
  ],
  "SWD 311": [
    {
      id: "os1",
      q: "What is the core difference between a Process and a Thread?",
      a: "A Process has its own independent virtual address space and file descriptors, whereas Threads share code, data, and heap while maintaining distinct program counters and stack frames.",
    },
    {
      id: "os2",
      q: "Explain thrashing in virtual memory operating systems.",
      a: "Thrashing occurs when the OS spends more time swapping pages between RAM and swap partition than executing user instructions, due to high working set pressure.",
    },
    {
      id: "os3",
      q: "What are Coffman's four conditions required for deadlock?",
      a: "Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.",
    },
    {
      id: "os4",
      q: "How does the Round Robin CPU scheduling algorithm work?",
      a: "Each ready process receives a fixed slice of CPU time (time quantum) in circular sequence, preempting long-running tasks for interactive fairness.",
    },
  ],
  "SWD 312": [
    {
      id: "db1",
      q: "What is Boyce-Codd Normal Form (BCNF)?",
      a: "A stricter version of 3NF where for every functional dependency X -> Y, the determinant X must be a superkey of the table.",
    },
    {
      id: "db2",
      q: "Why do B+ trees serve as the predominant indexing structure in modern relational engines?",
      a: "All data records are stored exclusively at the leaf level with linked pointers, enabling fast point lookups and sequential range scans with minimal disk I/O.",
    },
  ],
  "SWD 313": [
    {
      id: "cpp1",
      q: "What is RAII in modern C++ and why is it critical for memory safety?",
      a: "Resource Acquisition Is Initialization: resource lifetimes (heap memory, sockets, file locks) are bound to object scope, ensuring automatic release upon destruction.",
    },
    {
      id: "cpp2",
      q: "What is the difference between std::unique_ptr and std::shared_ptr?",
      a: "unique_ptr enforces strict sole ownership of an object with zero runtime overhead. shared_ptr maintains an atomic reference count allowing multiple owners.",
    },
  ],
};

export function buildGenericDeck(course?: Course): Flashcard[] {
  const title = course ? course.title : "Course Topic";
  return [
    {
      id: "g1",
      q: `What is the foundational theoretical premise of ${title}?`,
      a: `It establishes systematic principles for decomposing complex systems into testable, verifiable, and scalable components.`,
    },
    {
      id: "g2",
      q: `What is the primary practical trade-off encountered when implementing concepts from ${title}?`,
      a: `Balancing architectural simplicity and low initial latency against long-term extensibility and fault isolation under load.`,
    },
    {
      id: "g3",
      q: `Name a common failure mode or anti-pattern students encounter in ${title}.`,
      a: `Failing to handle asynchronous boundary conditions or coupling internal state representations directly to client interfaces.`,
    },
    {
      id: "g4",
      q: `How do the core methods of ${title} guarantee determinism or correctness?`,
      a: `By enforcing strict invariants, boundary assertions, and standardized state validation before committing transitions.`,
    },
    {
      id: "g5",
      q: `Summarize the principal takeaway from this study unit in one sentence.`,
      a: `Consistent abstractions, explicit error handling, and separation of concerns outperform ad-hoc optimizations in production environments.`,
    },
  ];
}

export const INITIAL_NOTES: CourseNote[] = [
  {
    id: "note-1",
    course: "AIT 311",
    title: "Computer Architecture: Cache Hierarchy & Pipeline Hazards",
    uploadedAt: "2026-09-14",
    status: "READY",
    cardCount: 5,
    deck: CURATED_DECKS["AIT 311"],
    fileName: "handwritten_ait311_lecture_week4.jpg",
    sourceType: "handwritten",
    isHandwritten: true,
    transcription: `# AIT 311: Computer Architecture (Week 4)
*Transcribed from Student Notebook*

## 1. Memory Hierarchy & Latency Gap
- Register Access: ~1 clock cycle (< 1 ns)
- L1 Cache: 1-4 cycles (Harvard split: L1-I and L1-D)
- L2 Cache: 10-20 cycles (unified on-die)
- L3 Cache: 40-75 cycles (shared across cores)
- Main Memory (DRAM): 150-300 cycles (Major bottleneck!)

## 2. Pipeline Hazard Categories
1. **Structural Hazard**: Hardware resource conflict (e.g. single memory port accessed for both fetch and writeback).
2. **Data Hazard**: RAW (Read-After-Write), WAR (Write-After-Read), WAW (Write-After-Write). Mitigation: Forwarding/Bypassing or Branch Delay Slots.
3. **Control Hazard**: Branch instruction branch target not yet known. Mitigation: Dynamic Branch Target Buffer (BTB) and 2-bit saturating counters.`,
    summary: "Handwritten notes on instruction pipelines, memory latency gaps, and hazard forwarding mechanisms.",
  },
  {
    id: "note-2",
    course: "SWD 311",
    title: "Operating System — Concurrency & Deadlock Coffman Rules",
    uploadedAt: "2026-09-12",
    status: "READY",
    cardCount: 4,
    deck: CURATED_DECKS["SWD 311"],
    fileName: "swd311-deadlock-prevention.pdf",
    sourceType: "file",
  },
  {
    id: "note-3",
    course: "SWD 312",
    title: "Database Design I — BCNF Normalization & Foreign Constraints",
    uploadedAt: "2026-09-10",
    status: "READY",
    cardCount: 2,
    deck: CURATED_DECKS["SWD 312"],
    fileName: "database-normalization-cheatsheet.docx",
    sourceType: "file",
  },
  {
    id: "note-4",
    course: "SWD 313",
    title: "C++ Programming — RAII, Smart Pointers & Move Semantics",
    uploadedAt: "2026-09-08",
    status: "READY",
    cardCount: 2,
    deck: CURATED_DECKS["SWD 313"],
    fileName: "cpp_smart_pointers_handout.pdf",
    sourceType: "file",
  },
];

export const CBT_QUESTION_BANK: Record<string, CBTQuestion[]> = {
  "AIT 311": [
    {
      id: "cbt-1",
      question: "Which of the following describes a Structural Hazard in a pipelined processor?",
      options: [
        "Two instructions attempting to use the same physical resource simultaneously",
        "An instruction attempting to use a register operand before a previous write completes",
        "A conditional branch whose target address is not yet computed",
        "A cache miss that triggers an interrupt handler",
      ],
      correctIndex: 0,
      explanation: "A structural hazard occurs when hardware lacks sufficient resources to execute conflicting instructions in the same clock cycle.",
      isGermanTrueFalse: true,
      germanCorrectBool: true,
      germanPenalty: 0.5,
      theoryAnswer: "A structural hazard occurs when two overlapping instructions require simultaneous access to a single hardware unit (such as memory bus or ALU). Solutions include hardware duplication (e.g. separate instruction and data caches) or pipeline stalling.",
      points: 5,
    },
    {
      id: "cbt-2",
      question: "In Amdahl's Law, if 75% of a program can be parallelized, what is the maximum theoretical speedup with infinite cores?",
      options: ["4x", "2.5x", "8x", "16x"],
      correctIndex: 0,
      explanation: "Max speedup = 1 / (1 - 0.75) = 1 / 0.25 = 4x.",
      isGermanTrueFalse: false,
      germanCorrectBool: false,
      germanPenalty: 0.5,
      theoryAnswer: "By Amdahl's Law, S = 1 / ((1 - p) + (p / s)). As cores approach infinity, p/s approaches 0, yielding S_max = 1 / (1 - p). With p = 0.75, S_max = 1 / 0.25 = 4.",
      points: 5,
    },
    {
      id: "cbt-3",
      question: "True or False (German): In Harvard architecture, data and instruction pipelines share the same unified bus.",
      options: ["True", "False"],
      correctIndex: 1,
      explanation: "False! Harvard architecture physically separates instruction and data buses; Von Neumann shares a unified bus.",
      isGermanTrueFalse: true,
      germanCorrectBool: false,
      germanPenalty: 0.5,
      theoryAnswer: "Contrast Von Neumann vs Harvard architectures with diagrams showing instruction memory bus vs data memory bus isolation.",
      points: 10,
    },
  ],
  "SWD 311": [
    {
      id: "cbt-os-1",
      question: "Which of the following is NOT one of Coffman's four conditions for deadlock?",
      options: [
        "Mutual Exclusion",
        "Hold and Wait",
        "Preemptive Resource Revocation",
        "Circular Wait",
      ],
      correctIndex: 2,
      explanation: "The condition is NO Preemption; preemptive revocation breaks deadlocks!",
      isGermanTrueFalse: true,
      germanCorrectBool: true,
      germanPenalty: 0.5,
      theoryAnswer: "Coffman's conditions: Mutual exclusion, Hold and wait, No preemption, Circular wait. Breaking any single condition prevents deadlock entirely.",
      points: 10,
    },
  ],
};

export const PRACTICAL_REPORTS: PracticalReport[] = [
  {
    id: "pr-1",
    course: "AIT 311",
    title: "Lab 03: Implementation of Arithmetic Logic Unit (ALU) 4-Bit Adder in Logisim",
    weekNumber: 3,
    aim: "To design, simulate, and verify a 4-bit parallel adder/subtractor circuit using 74LS283 Full Adder ICs and XOR control logic.",
    apparatus: [
      "Logisim Evolution v3.8.0 Simulator",
      "Digital Trainer Kit",
      "74LS86 Quad 2-input XOR Gate",
      "74LS283 4-Bit Binary Full Adder",
      "LED Logic Probes & 5V Regulated DC Supply",
    ],
    procedure: [
      "Construct truth tables for sum S and carry out Cout for 1-bit full adder cells.",
      "Cascade four 1-bit full adders connecting Cout(n) to Cin(n+1).",
      "Incorporate XOR gates on operand B with control wire SUB to implement 2's complement subtraction when SUB = 1.",
      "Apply test vectors 1101 + 0011 and verify zero flag (Z), sign flag (S), and overflow flag (V).",
    ],
    observations: "Circuit successfully toggles between addition (SUB = 0) and 2's complement subtraction (SUB = 1) with negligible propagation delay (~14ns).",
    conclusions: "The 4-bit adder/subtractor meets theoretical timing constraints and properly flags signed overflow for operands exceeding [-8, +7].",
    date: "2026-09-04",
  },
  {
    id: "pr-2",
    course: "SWD 312",
    title: "Lab 02: Relational Schema Normalization & PostgreSQL Constraint Triggers",
    weekNumber: 2,
    aim: "To decompose unnormalized student course registration table into 3NF and enforce referential integrity with ON DELETE CASCADE triggers.",
    apparatus: [
      "PostgreSQL 16 Engine",
      "DBeaver Universal Database Tool",
      "Visual Paradigm ERD Modeler",
    ],
    procedure: [
      "Analyze functional dependencies: F = { MatricNo -> Name, Dept; CourseCode -> Title, Units; (MatricNo, CourseCode) -> Grade }.",
      "Decompose into Students(MatricNo, Name, Dept), Courses(CourseCode, Title, Units), and Enrollments(MatricNo, CourseCode, Grade).",
      "Execute DDL statements and foreign key constraint validations.",
    ],
    observations: "Insertion anomalies eliminated; updating course credit unit updates a single master row without orphan records.",
    conclusions: "3NF decomposition successfully satisfies lossless join and dependency preservation properties.",
    date: "2026-09-11",
  },
];

export const INITIAL_PAST_QUESTIONS: PastQuestionPaper[] = [
  {
    id: "pq-1",
    course: "AIT 313",
    session: "2024/2025",
    examType: "Final Exam",
    uploadedAt: "2025-11-02",
    fileName: "AIT313_Final_Exam_2024_2025.pdf",
    fileSize: "2.4 MB",
    sampleQuestions: [
      "Question 1 (20 Marks): Given a relation R(A, B, C, D, E) with functional dependencies F = { A -> BC, CD -> E, B -> D, E -> A }, compute the candidate keys and decompose R into Boyce-Codd Normal Form (BCNF).",
      "Question 2 (15 Marks): Explain the Two-Phase Locking (2PL) protocol. Contrast Strict 2PL with Rigorous 2PL and analyze their vulnerability to cascading rollbacks.",
      "Question 3 (15 Marks): Draw a B+ tree of order 4 inserting keys in sequence: 10, 20, 5, 15, 30, 25, 35, 45. Show split propagation.",
    ],
  },
  {
    id: "pq-2",
    course: "SWD 312",
    session: "2024/2025",
    examType: "First CA",
    uploadedAt: "2025-03-14",
    fileName: "SWD312_First_CA_2024_2025.pdf",
    fileSize: "1.1 MB",
    sampleQuestions: [
      "Question 1: Explain the Liskov Substitution Principle with a practical code violation example involving Rectangle and Square classes.",
      "Question 2: Implement the Factory Method design pattern to instantiate cross-platform UI buttons in TypeScript/Java.",
    ],
  },
  {
    id: "pq-3",
    course: "MTH 311",
    session: "2023/2024",
    examType: "Final Exam",
    uploadedAt: "2024-06-20",
    fileName: "MTH311_Final_2023_2024.pdf",
    fileSize: "3.8 MB",
    sampleQuestions: [
      "Question 1: Derive Newton-Raphson's formula and calculate the real root of f(x) = x^3 - 2x - 5 to 4 decimal places starting at x0 = 2.",
      "Question 2: Solve the boundary value problem y'' + 4y = 0 using finite differences with step h = 0.25.",
    ],
  },
  {
    id: "pq-4",
    course: "AIT 311",
    session: "2024/2025",
    examType: "Second CA",
    uploadedAt: "2025-05-18",
    fileName: "AIT311_Second_CA_2024_2025.pdf",
    fileSize: "1.6 MB",
    sampleQuestions: [
      "Question 1: In Banker's Algorithm, with 5 processes and 3 resource types A, B, C, evaluate whether the system is in a safe state given Allocation and Max matrices.",
      "Question 2: Compute page fault count using LRU vs FIFO page replacement for reference string: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3.",
    ],
  },
];
