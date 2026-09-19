import { Institution, Course, InstitutionType } from "../types";

export const POLYTECHNIC_LEVELS = [
  { value: "ND 1", label: "ND 1 (National Diploma I / Year 1)", short: "ND 1" },
  { value: "ND 2", label: "ND 2 (National Diploma II / Year 2)", short: "ND 2" },
  { value: "HND 1", label: "HND 1 (Higher National Diploma I / Year 3)", short: "HND 1" },
  { value: "HND 2", label: "HND 2 (Higher National Diploma II / Year 4)", short: "HND 2" },
];

export const UNIVERSITY_LEVELS = [
  { value: "100 Level", label: "100 Level (Freshman / Year 1)", short: "100L" },
  { value: "200 Level", label: "200 Level (Sophomore / Year 2)", short: "200L" },
  { value: "300 Level", label: "300 Level (Junior / Year 3)", short: "300L" },
  { value: "400 Level", label: "400 Level (Senior / Year 4)", short: "400L" },
  { value: "500 Level", label: "500 Level (Final Year / Professional)", short: "500L" },
];

export const INSTITUTIONS: Institution[] = [
  {
    id: "FEDPONEK",
    name: "Federal Polytechnic Nekede, Owerri",
    shortName: "FEDPONEK",
    type: "polytechnic",
    divisionLabel: "School",
    divisions: [
      {
        name: "School of Information & Communication Technology (SICT)",
        departments: [
          "Software & Web Development",
          "Computer Science",
          "Cybersecurity Technology",
        ],
      },
      {
        name: "School of Engineering Technology (SET)",
        departments: [
          "Electrical & Electronics Engineering",
          "Computer Engineering Technology",
          "Mechanical Engineering Technology",
        ],
      },
      {
        name: "School of Business & Management Technology (SBMT)",
        departments: [
          "Accountancy",
          "Business Administration & Management",
          "Banking & Finance",
        ],
      },
    ],
    supportedLevels: ["ND 1", "ND 2", "HND 1", "HND 2"],
  },
  {
    id: "YABATECH",
    name: "Yaba College of Technology, Lagos",
    shortName: "YABATECH",
    type: "polytechnic",
    divisionLabel: "School",
    divisions: [
      {
        name: "School of Technology",
        departments: [
          "Computer Science",
          "Food Technology",
          "Hospitality Management",
        ],
      },
      {
        name: "School of Engineering",
        departments: [
          "Electrical Engineering",
          "Civil Engineering",
          "Mechanical Engineering",
        ],
      },
    ],
    supportedLevels: ["ND 1", "ND 2", "HND 1", "HND 2"],
  },
  {
    id: "UNILAG",
    name: "University of Lagos, Akoka",
    shortName: "UNILAG",
    type: "university",
    divisionLabel: "Faculty",
    divisions: [
      {
        name: "Faculty of Science",
        departments: [
          "Computer Sciences",
          "Mathematics",
          "Physics",
        ],
      },
      {
        name: "Faculty of Engineering",
        departments: [
          "Systems Engineering",
          "Electrical & Electronics Engineering",
          "Mechanical Engineering",
        ],
      },
      {
        name: "Faculty of Management Sciences",
        departments: [
          "Finance",
          "Business Administration",
          "Accounting",
        ],
      },
    ],
    supportedLevels: ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"],
  },
  {
    id: "FUTO",
    name: "Federal University of Technology, Owerri",
    shortName: "FUTO",
    type: "university",
    divisionLabel: "School",
    divisions: [
      {
        name: "School of Computing & Information Technology (SCIT)",
        departments: [
          "Software Engineering",
          "Computer Science",
          "Cybersecurity",
          "Information Technology",
        ],
      },
      {
        name: "School of Engineering & Engineering Technology (SEET)",
        departments: [
          "Electrical/Electronic Engineering",
          "Mechatronics Engineering",
          "Petroleum Engineering",
        ],
      },
    ],
    supportedLevels: ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"],
  },
  {
    id: "CU",
    name: "Covenant University, Ota",
    shortName: "CU",
    type: "university",
    divisionLabel: "College",
    divisions: [
      {
        name: "College of Science & Technology (CST)",
        departments: [
          "Computer Science",
          "Management Information Systems",
        ],
      },
      {
        name: "College of Engineering (COE)",
        departments: [
          "Electrical & Information Engineering",
          "Mechanical Engineering",
        ],
      },
    ],
    supportedLevels: ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"],
  },
  {
    id: "UNN",
    name: "University of Nigeria, Nsukka",
    shortName: "UNN",
    type: "university",
    divisionLabel: "Faculty",
    divisions: [
      {
        name: "Faculty of Physical Sciences",
        departments: [
          "Computer Science",
          "Mathematics",
          "Physics & Astronomy",
        ],
      },
      {
        name: "Faculty of Engineering",
        departments: [
          "Electronic Engineering",
          "Electrical Engineering",
          "Mechanical Engineering",
        ],
      },
    ],
    supportedLevels: ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"],
  },
  {
    id: "UI",
    name: "University of Ibadan, Ibadan",
    shortName: "UI",
    type: "university",
    divisionLabel: "Faculty",
    divisions: [
      {
        name: "Faculty of Science",
        departments: [
          "Computer Science",
          "Statistics",
          "Mathematics",
        ],
      },
      {
        name: "Faculty of Technology",
        departments: [
          "Electrical & Electronic Engineering",
          "Industrial & Production Engineering",
        ],
      },
    ],
    supportedLevels: ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"],
  },
  {
    id: "OAU",
    name: "Obafemi Awolowo University, Ile-Ife",
    shortName: "OAU",
    type: "university",
    divisionLabel: "Faculty",
    divisions: [
      {
        name: "Faculty of Technology",
        departments: [
          "Computer Science & Engineering",
          "Electronic & Electrical Engineering",
        ],
      },
      {
        name: "Faculty of Science",
        departments: [
          "Physics",
          "Mathematics",
        ],
      },
    ],
    supportedLevels: ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"],
  },
  {
    id: "ABU",
    name: "Ahmadu Bello University, Zaria",
    shortName: "ABU",
    type: "university",
    divisionLabel: "Faculty",
    divisions: [
      {
        name: "Faculty of Science",
        departments: [
          "Computer Science",
          "Mathematics",
        ],
      },
      {
        name: "Faculty of Engineering",
        departments: [
          "Computer Engineering",
          "Electrical Engineering",
        ],
      },
    ],
    supportedLevels: ["100 Level", "200 Level", "300 Level", "400 Level", "500 Level"],
  },
  {
    id: "IMT",
    name: "Institute of Management & Technology, Enugu",
    shortName: "IMT",
    type: "polytechnic",
    divisionLabel: "School",
    divisions: [
      {
        name: "School of Technology",
        departments: [
          "Computer Science",
          "Statistics",
        ],
      },
      {
        name: "School of Engineering",
        departments: [
          "Electrical/Electronic Engineering",
          "Mechanical Engineering Technology",
        ],
      },
    ],
    supportedLevels: ["ND 1", "ND 2", "HND 1", "HND 2"],
  },
];

export const SEGREGATED_COURSES: Course[] = [
  // ==========================================
  // POLYTECHNIC: FEDPONEK - SICT - Software & Web Development (HND 1)
  // ==========================================
  {
    code: "SWD 311",
    title: "Operating System",
    institutionType: "polytechnic",
    institutionId: "FEDPONEK",
    institutionName: "Federal Polytechnic Nekede, Owerri",
    facultyOrSchool: "School of Information & Communication Technology (SICT)",
    department: "Software & Web Development",
    level: "HND 1",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Process synchronization, scheduling algorithms, memory management, and deadlock prevention.",
    topics: [
      "Process Concept, State Models & PCB Structures",
      "CPU Scheduling Algorithms (FCFS, SJF, Round Robin, Multi-level Queue)",
      "Process Synchronization, Critical Section Problem & Semaphores",
      "Coffman Deadlock Conditions, Banker's Algorithm & Detection",
      "Virtual Memory, Page Replacement (FIFO, LRU) & Thrashing",
    ],
  },
  {
    code: "SWD 312",
    title: "Database Design I",
    institutionType: "polytechnic",
    institutionId: "FEDPONEK",
    institutionName: "Federal Polytechnic Nekede, Owerri",
    facultyOrSchool: "School of Information & Communication Technology (SICT)",
    department: "Software & Web Development",
    level: "HND 1",
    units: 3,
    semester: "First Semester",
    starred: false,
    description: "Relational data modeling, SQL DDL/DML, normalization up to BCNF, and indexing.",
    topics: [
      "Entity Relationship Modeling (ERD) & Crow's Foot Notation",
      "Relational Algebra (Select, Project, Cartesian Product, Joins)",
      "Functional Dependencies & Normal Forms (1NF, 2NF, 3NF, BCNF)",
      "PostgreSQL Indexing Architectures (B-Trees, Hash, GiST)",
      "ACID Transactions, Isolation Levels & Concurrency Control",
    ],
  },
  {
    code: "SWD 313",
    title: "C++ Programming",
    institutionType: "polytechnic",
    institutionId: "FEDPONEK",
    institutionName: "Federal Polytechnic Nekede, Owerri",
    facultyOrSchool: "School of Information & Communication Technology (SICT)",
    department: "Software & Web Development",
    level: "HND 1",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Modern C++ memory management, RAII, templates, STL containers, and object-oriented architectures.",
    topics: [
      "Pointers, Dynamic Memory Allocation & RAII Lifecycle",
      "Classes, Virtual Functions, Polymorphism & VTables",
      "Standard Template Library (vector, map, unordered_set, algorithms)",
      "Smart Pointers (unique_ptr, shared_ptr, weak_ptr)",
      "Template Metaprogramming & Exception Safety",
    ],
  },
  {
    code: "SWD 314",
    title: "Operation Research",
    institutionType: "polytechnic",
    institutionId: "FEDPONEK",
    institutionName: "Federal Polytechnic Nekede, Owerri",
    facultyOrSchool: "School of Information & Communication Technology (SICT)",
    department: "Software & Web Development",
    level: "HND 1",
    units: 2,
    semester: "First Semester",
    starred: false,
    description: "Linear programming, simplex method, transportation models, and network analysis.",
  },
  {
    code: "SWD 315",
    title: "Data Comms & Network",
    institutionType: "polytechnic",
    institutionId: "FEDPONEK",
    institutionName: "Federal Polytechnic Nekede, Owerri",
    facultyOrSchool: "School of Information & Communication Technology (SICT)",
    department: "Software & Web Development",
    level: "HND 1",
    units: 3,
    semester: "First Semester",
    starred: false,
    description: "OSI and TCP/IP stack layers, physical transmission media, subnets, and routing protocols.",
  },
  {
    code: "AIT 311",
    title: "Computer Architecture",
    institutionType: "polytechnic",
    institutionId: "FEDPONEK",
    institutionName: "Federal Polytechnic Nekede, Owerri",
    facultyOrSchool: "School of Information & Communication Technology (SICT)",
    department: "Computer Science",
    level: "HND 1",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Von Neumann vs Harvard design, instruction pipelining, hazards, and memory cache hierarchy.",
    topics: [
      "Instruction Set Architectures (RISC vs CISC)",
      "Instruction Pipelining, Hazard Stalling & Forwarding",
      "Memory Hierarchy, Cache Mapping (Direct, Set-Associative)",
      "Bus Protocols, DMA & Interrupt Handling Mechanisms",
    ],
  },

  // ==========================================
  // POLYTECHNIC: FEDPONEK - SICT - ND 1 (National Diploma I)
  // ==========================================
  {
    code: "COM 111",
    title: "Introduction to Computing",
    institutionType: "polytechnic",
    institutionId: "FEDPONEK",
    institutionName: "Federal Polytechnic Nekede, Owerri",
    facultyOrSchool: "School of Information & Communication Technology (SICT)",
    department: "Computer Science",
    level: "ND 1",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Computer hardware components, binary arithmetic, number systems, and operating environments.",
    topics: [
      "Evolution of Computing & Generation of Computers",
      "Number Systems (Binary, Octal, Hexadecimal Conversions)",
      "Logic Gates & Boolean Algebra Foundations",
      "System Software vs Application Software",
    ],
  },
  {
    code: "COM 112",
    title: "Digital Electronics I",
    institutionType: "polytechnic",
    institutionId: "FEDPONEK",
    institutionName: "Federal Polytechnic Nekede, Owerri",
    facultyOrSchool: "School of Information & Communication Technology (SICT)",
    department: "Computer Science",
    level: "ND 1",
    units: 3,
    semester: "First Semester",
    starred: false,
    description: "Logic gates, Karnaugh mapping, combinational circuits, adders, and flip-flops.",
  },
  {
    code: "COM 113",
    title: "Introduction to Algorithm & Flowcharts",
    institutionType: "polytechnic",
    institutionId: "FEDPONEK",
    institutionName: "Federal Polytechnic Nekede, Owerri",
    facultyOrSchool: "School of Information & Communication Technology (SICT)",
    department: "Software & Web Development",
    level: "ND 1",
    units: 2,
    semester: "First Semester",
    starred: true,
    description: "Pseudocode conventions, iteration, conditional branches, and flowchart standards.",
  },
  {
    code: "GNS 101",
    title: "Use of English I",
    institutionType: "polytechnic",
    institutionId: "FEDPONEK",
    institutionName: "Federal Polytechnic Nekede, Owerri",
    facultyOrSchool: "School of Information & Communication Technology (SICT)",
    department: "Software & Web Development",
    level: "ND 1",
    units: 2,
    semester: "First Semester",
    starred: false,
    description: "Grammar, sentence synthesis, phonetics, and academic writing techniques.",
  },

  // ==========================================
  // POLYTECHNIC: FEDPONEK - SICT - ND 2 (National Diploma II)
  // ==========================================
  {
    code: "COM 211",
    title: "Java Programming I (OOP)",
    institutionType: "polytechnic",
    institutionId: "FEDPONEK",
    institutionName: "Federal Polytechnic Nekede, Owerri",
    facultyOrSchool: "School of Information & Communication Technology (SICT)",
    department: "Computer Science",
    level: "ND 2",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Object-oriented fundamentals in Java, classes, encapsulation, inheritance, and Swing GUI.",
  },
  {
    code: "COM 212",
    title: "Database Management Systems",
    institutionType: "polytechnic",
    institutionId: "FEDPONEK",
    institutionName: "Federal Polytechnic Nekede, Owerri",
    facultyOrSchool: "School of Information & Communication Technology (SICT)",
    department: "Software & Web Development",
    level: "ND 2",
    units: 3,
    semester: "First Semester",
    starred: false,
    description: "Relational database concepts, SQL queries, normalization, and integrity rules.",
  },
  {
    code: "COM 213",
    title: "Data Structures & Algorithms",
    institutionType: "polytechnic",
    institutionId: "FEDPONEK",
    institutionName: "Federal Polytechnic Nekede, Owerri",
    facultyOrSchool: "School of Information & Communication Technology (SICT)",
    department: "Software & Web Development",
    level: "ND 2",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Linked lists, stacks, queues, binary trees, sorting algorithms, and Big-O notation.",
  },

  // ==========================================
  // POLYTECHNIC: FEDPONEK - SICT - HND 2 (Higher National Diploma II)
  // ==========================================
  {
    code: "SWD 411",
    title: "Distributed Systems & Cloud Computing",
    institutionType: "polytechnic",
    institutionId: "FEDPONEK",
    institutionName: "Federal Polytechnic Nekede, Owerri",
    facultyOrSchool: "School of Information & Communication Technology (SICT)",
    department: "Software & Web Development",
    level: "HND 2",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Remote procedure calls, distributed consistency models, microservices, and Docker containers.",
  },
  {
    code: "SWD 412",
    title: "Software Quality Assurance & Testing",
    institutionType: "polytechnic",
    institutionId: "FEDPONEK",
    institutionName: "Federal Polytechnic Nekede, Owerri",
    facultyOrSchool: "School of Information & Communication Technology (SICT)",
    department: "Software & Web Development",
    level: "HND 2",
    units: 2,
    semester: "First Semester",
    starred: false,
    description: "Unit testing, integration testing, CI/CD pipelines, automated regression suites, and static analysis.",
  },
  {
    code: "SWD 413",
    title: "Mobile Application Development",
    institutionType: "polytechnic",
    institutionId: "FEDPONEK",
    institutionName: "Federal Polytechnic Nekede, Owerri",
    facultyOrSchool: "School of Information & Communication Technology (SICT)",
    department: "Software & Web Development",
    level: "HND 2",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Cross-platform mobile frameworks, state management, REST API integration, and offline persistence.",
  },

  // ==========================================
  // UNIVERSITY: UNILAG - Faculty of Science - 100 Level
  // ==========================================
  {
    code: "CSC 101",
    title: "Introduction to Computer Science",
    institutionType: "university",
    institutionId: "UNILAG",
    institutionName: "University of Lagos, Akoka",
    facultyOrSchool: "Faculty of Science",
    department: "Computer Sciences",
    level: "100 Level",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Foundational computing concepts, hardware architecture, operating system fundamentals, and web protocols.",
    topics: [
      "History and Evolution of Digital Computing Systems",
      "Binary Number Systems, Two's Complement & Floating Point",
      "Basic Algorithm Design & Problem Solving Flowcharts",
      "Network Topologies & World Wide Web Architecture",
    ],
  },
  {
    code: "MAT 101",
    title: "General Mathematics I (Algebra & Trigonometry)",
    institutionType: "university",
    institutionId: "UNILAG",
    institutionName: "University of Lagos, Akoka",
    facultyOrSchool: "Faculty of Science",
    department: "Mathematics",
    level: "100 Level",
    units: 3,
    semester: "First Semester",
    starred: false,
    description: "Set theory, quadratic equations, mathematical induction, binomial theorem, and trigonometric identities.",
  },
  {
    code: "PHY 101",
    title: "General Physics I (Mechanics & Properties of Matter)",
    institutionType: "university",
    institutionId: "UNILAG",
    institutionName: "University of Lagos, Akoka",
    facultyOrSchool: "Faculty of Science",
    department: "Computer Sciences",
    level: "100 Level",
    units: 3,
    semester: "First Semester",
    starred: false,
    description: "Newtonian kinematics, vectors, work-energy theorem, rotational dynamics, and fluid mechanics.",
  },

  // ==========================================
  // UNIVERSITY: UNILAG - Faculty of Science - 200 Level
  // ==========================================
  {
    code: "CSC 201",
    title: "Computer Programming I (Structured & OOP)",
    institutionType: "university",
    institutionId: "UNILAG",
    institutionName: "University of Lagos, Akoka",
    facultyOrSchool: "Faculty of Science",
    department: "Computer Sciences",
    level: "200 Level",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Structured program design, procedural abstraction, arrays, classes, and object lifetimes.",
  },
  {
    code: "CSC 205",
    title: "Operating Systems Principles",
    institutionType: "university",
    institutionId: "UNILAG",
    institutionName: "University of Lagos, Akoka",
    facultyOrSchool: "Faculty of Science",
    department: "Computer Sciences",
    level: "200 Level",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Process synchronization, semaphores, memory paging, file systems, and virtual machine abstractions.",
  },

  // ==========================================
  // UNIVERSITY: UNILAG - Faculty of Science - 300 Level
  // ==========================================
  {
    code: "CSC 301",
    title: "Structured Query Language & Database Systems",
    institutionType: "university",
    institutionId: "UNILAG",
    institutionName: "University of Lagos, Akoka",
    facultyOrSchool: "Faculty of Science",
    department: "Computer Sciences",
    level: "300 Level",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Database engine architecture, relational calculus, query optimization, query trees, and transaction logs.",
    topics: [
      "Relational Query Processing & Cost-Based Optimizer",
      "Multi-Version Concurrency Control (MVCC) & Write-Ahead Logs",
      "Database Recovery Mechanisms (ARIES Protocol)",
      "Distributed Database Architectures & CAP Theorem",
    ],
  },
  {
    code: "CSC 303",
    title: "Compiler Construction & Automata Theory",
    institutionType: "university",
    institutionId: "UNILAG",
    institutionName: "University of Lagos, Akoka",
    facultyOrSchool: "Faculty of Science",
    department: "Computer Sciences",
    level: "300 Level",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Lexical analysis, LL/LR parsing tables, abstract syntax trees, and intermediate code generation.",
  },
  {
    code: "CSC 305",
    title: "Artificial Intelligence & Heuristics",
    institutionType: "university",
    institutionId: "UNILAG",
    institutionName: "University of Lagos, Akoka",
    facultyOrSchool: "Faculty of Science",
    department: "Computer Sciences",
    level: "300 Level",
    units: 3,
    semester: "First Semester",
    starred: false,
    description: "Informed search (A*), constraint satisfaction, minimax game trees, knowledge graphs, and expert systems.",
  },

  // ==========================================
  // UNIVERSITY: UNILAG - Faculty of Science - 400 Level
  // ==========================================
  {
    code: "CSC 401",
    title: "Design & Analysis of Algorithms",
    institutionType: "university",
    institutionId: "UNILAG",
    institutionName: "University of Lagos, Akoka",
    facultyOrSchool: "Faculty of Science",
    department: "Computer Sciences",
    level: "400 Level",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Divide-and-conquer, dynamic programming, network flow, NP-completeness reductions, and approximation.",
    topics: [
      "Master Theorem & Recurrence Relations",
      "Dynamic Programming (Matrix Chain, 0/1 Knapsack, Bellman-Ford)",
      "Maximum Flow & Ford-Fulkerson Algorithm",
      "Complexity Classes P, NP, NP-Complete & Reductions",
    ],
  },
  {
    code: "CSC 403",
    title: "Machine Learning & Neural Architectures",
    institutionType: "university",
    institutionId: "UNILAG",
    institutionName: "University of Lagos, Akoka",
    facultyOrSchool: "Faculty of Science",
    department: "Computer Sciences",
    level: "400 Level",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Supervised learning, gradient descent optimization, backpropagation, convolutional networks, and transformers.",
  },

  // ==========================================
  // UNIVERSITY: FUTO - SCIT - Software Engineering (500 Level)
  // ==========================================
  {
    code: "SEN 501",
    title: "Safety-Critical & Fault-Tolerant Systems",
    institutionType: "university",
    institutionId: "FUTO",
    institutionName: "Federal University of Technology, Owerri",
    facultyOrSchool: "School of Computing & Information Technology (SCIT)",
    department: "Software Engineering",
    level: "500 Level",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Formal verification, model checking, Byzantine fault tolerance, dual modular redundancy, and fail-safe design.",
    topics: [
      "Formal Methods & Temporal Logic Specifications",
      "Byzantine Agreement & Distributed Consensus",
      "Hardware-Software Redundancy Architectures",
      "Safety Assurance Cases & ISO 26262 Standards",
    ],
  },
  {
    code: "SEN 503",
    title: "Enterprise Systems Integration & SOA",
    institutionType: "university",
    institutionId: "FUTO",
    institutionName: "Federal University of Technology, Owerri",
    facultyOrSchool: "School of Computing & Information Technology (SCIT)",
    department: "Software Engineering",
    level: "500 Level",
    units: 3,
    semester: "First Semester",
    starred: false,
    description: "Message brokers (Kafka/RabbitMQ), event-driven architectures, saga distributed transactions, and API gateways.",
  },

  // ==========================================
  // UNIVERSITY: UNN (University of Nigeria, Nsukka) - 300 / 400 Level
  // ==========================================
  {
    code: "COS 311",
    title: "Operating Systems & Concurrency",
    institutionType: "university",
    institutionId: "UNN",
    institutionName: "University of Nigeria, Nsukka",
    facultyOrSchool: "Faculty of Physical Sciences",
    department: "Computer Science",
    level: "300 Level",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "UNN syllabus on process synchronization, mutex locks, paging, and kernel I/O sub-systems.",
    topics: [
      "Process Management & Multi-threading models",
      "Deadlock Characterization & Prevention Protocols",
      "Virtual Memory Architecture & Page Table Structures",
      "File System Implementation & Storage Management",
    ],
  },
  {
    code: "COS 415",
    title: "Distributed Computing & Cloud Systems",
    institutionType: "university",
    institutionId: "UNN",
    institutionName: "University of Nigeria, Nsukka",
    facultyOrSchool: "Faculty of Physical Sciences",
    department: "Computer Science",
    level: "400 Level",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Cluster architectures, consensus protocols, map-reduce algorithms, and cloud virtualization.",
  },

  // ==========================================
  // UNIVERSITY: UI (University of Ibadan) - 300 / 400 Level
  // ==========================================
  {
    code: "CSC 314",
    title: "Database Management Systems",
    institutionType: "university",
    institutionId: "UI",
    institutionName: "University of Ibadan, Ibadan",
    facultyOrSchool: "Faculty of Science",
    department: "Computer Science",
    level: "300 Level",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Relational algebra, normal forms (1NF to BCNF), indexing (B+ trees), and transaction ACID properties.",
    topics: [
      "Relational Query Languages & Extended Relational Algebra",
      "Functional Dependencies & Normalization Theory",
      "Concurrency Control Protocols & Two-Phase Locking",
      "Query Optimization & Execution Planning",
    ],
  },
  {
    code: "CSC 421",
    title: "Software Engineering Methodologies",
    institutionType: "university",
    institutionId: "UI",
    institutionName: "University of Ibadan, Ibadan",
    facultyOrSchool: "Faculty of Science",
    department: "Computer Science",
    level: "400 Level",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Agile frameworks, test-driven development, CI/CD pipelines, and software architectural patterns.",
  },

  // ==========================================
  // UNIVERSITY: OAU (Obafemi Awolowo University) - 300 / 400 Level
  // ==========================================
  {
    code: "CPE 301",
    title: "Computer Architecture & Organization",
    institutionType: "university",
    institutionId: "OAU",
    institutionName: "Obafemi Awolowo University, Ile-Ife",
    facultyOrSchool: "Faculty of Technology",
    department: "Computer Science & Engineering",
    level: "300 Level",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "MIPS instruction set, pipelining, branch prediction, cache hierarchies, and superscalar designs.",
    topics: [
      "Instruction Set Architecture & Register Allocation",
      "Five-Stage Instruction Pipelining & Hazard Resolution",
      "Multi-level Cache Mapping & Replacement Policies",
      "I/O Interfacing & DMA Controllers",
    ],
  },

  // ==========================================
  // UNIVERSITY: ABU (Ahmadu Bello University) - 300 / 400 Level
  // ==========================================
  {
    code: "COEN 311",
    title: "Microprocessor Systems & Interfacing",
    institutionType: "university",
    institutionId: "ABU",
    institutionName: "Ahmadu Bello University, Zaria",
    facultyOrSchool: "Faculty of Engineering",
    department: "Computer Engineering",
    level: "300 Level",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "x86 architecture, assembly programming, bus protocols, interrupts, and embedded system interfacing.",
  },

  // ==========================================
  // POLYTECHNIC: IMT Enugu (Institute of Management & Technology) - ND 1 / HND 1
  // ==========================================
  {
    code: "COM 311",
    title: "Operating Systems Technology",
    institutionType: "polytechnic",
    institutionId: "IMT",
    institutionName: "Institute of Management & Technology, Enugu",
    facultyOrSchool: "School of Technology",
    department: "Computer Science",
    level: "HND 1",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "NBTE accredited curriculum for Higher National Diploma Computer Science covering process synchronization and memory management.",
    topics: [
      "Operating System Architecture & Kernel Modules",
      "Process Lifecycle & Context Switching",
      "Memory Allocation (Segmentation & Paging)",
      "Device Management & Disk Scheduling",
    ],
  },
  {
    code: "COM 312",
    title: "Database Design & Application",
    institutionType: "polytechnic",
    institutionId: "IMT",
    institutionName: "Institute of Management & Technology, Enugu",
    facultyOrSchool: "School of Technology",
    department: "Computer Science",
    level: "HND 1",
    units: 3,
    semester: "First Semester",
    starred: true,
    description: "Entity-relationship modeling, SQL DDL/DML, and client-server database implementations.",
  },
];

export function getLevelsForInstitutionType(type: InstitutionType) {
  return type === "polytechnic" ? POLYTECHNIC_LEVELS : UNIVERSITY_LEVELS;
}

export function getInstitutionById(id: string): Institution | undefined {
  return INSTITUTIONS.find((inst) => inst.id === id);
}

export function getDefaultCohortForInstitution(inst: Institution) {
  const firstDivision = inst.divisions[0];
  const firstDept = firstDivision?.departments[0] || "Computer Science";
  const firstLevel = inst.supportedLevels[0] || (inst.type === "polytechnic" ? "ND 1" : "100 Level");

  return {
    institutionType: inst.type,
    institutionId: inst.id,
    institutionName: inst.name,
    facultyOrSchool: firstDivision?.name || "Academic Division",
    department: firstDept,
    level: firstLevel,
  };
}

export const ALL_INSTITUTION_COURSES = SEGREGATED_COURSES;

