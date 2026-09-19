import { useState, FormEvent } from "react";
import { UserProfile, UserRole, Course } from "../types";
import {
  Shield,
  Megaphone,
  UserCheck,
  X,
  Plus,
  Key,
  Copy,
  Check,
  Search,
  Trash2,
  Lock,
  Mail,
  User,
  Building,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface AdminUserProvisioningModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  courses: Course[];
  usersRoster: UserProfile[];
  onProvisionUser: (newUser: UserProfile) => void;
  onRevokeUser: (userId: string) => void;
}

export function AdminUserProvisioningModal({
  isOpen,
  onClose,
  currentUser,
  courses,
  usersRoster,
  onProvisionUser,
  onRevokeUser,
}: AdminUserProvisioningModalProps) {
  const [activeTab, setActiveTab] = useState<"provision" | "directory">("provision");
  const [roleToAssign, setRoleToAssign] = useState<"courserep" | "admin">("courserep");

  // Form states
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState(""); // Matric No or Staff ID
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Software & Web Development");
  const [level, setLevel] = useState("HND 1 • 300 Level");
  const [repCourseCode, setRepCourseCode] = useState(courses[0]?.code ? `${courses[0].code} (${courses[0].title})` : "SWD 311 (Operating System)");
  const [staffTitle, setStaffTitle] = useState("Academic Board & Examination Officer");
  const [tempPassword, setTempPassword] = useState("LUCID-AUTH-2026");

  // Success voucher state
  const [provisionedVoucher, setProvisionedVoucher] = useState<UserProfile | null>(null);
  const [copiedVoucher, setCopiedVoucher] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | UserRole>("all");

  if (!isOpen) return null;

  const handleGeneratePassword = () => {
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const prefix = roleToAssign === "admin" ? "ADMIN" : "CREP";
    setTempPassword(`${prefix}-${randomHex}`);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !identifier.trim() || !email.trim()) return;

    const initials = name
      .trim()
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || (roleToAssign === "admin" ? "AD" : "CR");

    const newUser: UserProfile = {
      id: `usr-assigned-${Date.now()}`,
      name: name.trim(),
      matricNo: identifier.trim(),
      email: email.trim(),
      department,
      level: roleToAssign === "admin" ? "Faculty Board" : level,
      avatarInitials: initials,
      isLoggedIn: false,
      role: roleToAssign,
      repCourseCode: roleToAssign === "courserep" ? repCourseCode : undefined,
      staffTitle: roleToAssign === "admin" ? staffTitle : undefined,
      assignedBy: `${currentUser.name} (${currentUser.staffTitle || "HOD"})`,
      assignedAt: new Date().toISOString().slice(0, 10),
      password: tempPassword,
    };

    onProvisionUser(newUser);
    setProvisionedVoucher(newUser);

    // Reset fields for next assignment
    setName("");
    setIdentifier("");
    setEmail("");
  };

  const handleCopyVoucher = () => {
    if (!provisionedVoucher) return;
    const text = `=== OFFICIAL LUCID ACCOUNT CREDENTIALS ===\nAccount Type: ${provisionedVoucher.role === "admin" ? "Department Administrator" : "Course Representative"}\nFull Name: ${provisionedVoucher.name}\nMatric / Staff ID: ${provisionedVoucher.matricNo}\nEmail: ${provisionedVoucher.email}\nAssigned Scope: ${provisionedVoucher.role === "admin" ? provisionedVoucher.staffTitle : provisionedVoucher.repCourseCode}\nTemporary Access Key: ${provisionedVoucher.password}\nAssigned by: ${provisionedVoucher.assignedBy}\n\nSign in at the Lucid Portal: https://ais-dev-u4y3yb7t5mkpaejrmctkcx-102479570505.europe-west2.run.app`;
    
    navigator.clipboard.writeText(text);
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2500);
  };

  const filteredRoster = usersRoster.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.matricNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-neutral-200/90 dark:border-slate-800 shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-purple-900 text-white px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-purple-200 border border-white/20">
              <Shield size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Department Access & Role Governance</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-700 text-purple-200 border border-purple-500/50">
                  Admin Only
                </span>
              </div>
              <p className="text-xs text-purple-200/80">
                Course Rep and Administrator accounts must be provisioned by the Department Administrator.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-slate-800 bg-neutral-50 dark:bg-slate-950 px-6 shrink-0">
          <button
            onClick={() => {
              setActiveTab("provision");
              setProvisionedVoucher(null);
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "provision"
                ? "border-purple-700 text-purple-900 dark:text-purple-300 bg-white dark:bg-slate-900"
                : "border-transparent text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200"
            }`}
          >
            <Plus size={14} />
            <span>Assign / Provision Account</span>
          </button>
          <button
            onClick={() => setActiveTab("directory")}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "directory"
                ? "border-purple-700 text-purple-900 dark:text-purple-300 bg-white dark:bg-slate-900"
                : "border-transparent text-neutral-500 dark:text-slate-400 hover:text-neutral-800 dark:hover:text-slate-200"
            }`}
          >
            <UserCheck size={14} />
            <span>Assigned Accounts Directory ({usersRoster.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === "provision" && !provisionedVoucher && (
            <div className="space-y-5">
              {/* Role Type Selector */}
              <div>
                <label className="block text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Select Role to Assign
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRoleToAssign("courserep");
                      setTempPassword("CREP-2026");
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      roleToAssign === "courserep"
                        ? "bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 ring-2 ring-amber-400/20 shadow-xs"
                        : "bg-neutral-50 dark:bg-slate-800 border-neutral-200 dark:border-slate-700 hover:border-neutral-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                        <Megaphone size={14} />
                      </div>
                      <span className="font-bold text-xs text-amber-950 dark:text-amber-300">Course Representative</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 dark:text-slate-300 leading-snug">
                      Authorized class officer with cohort announcement rights and rep-verified note badges.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRoleToAssign("admin");
                      setTempPassword("ADMIN-2026");
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      roleToAssign === "admin"
                        ? "bg-purple-50/80 dark:bg-purple-950/40 border-purple-400 dark:border-purple-700 ring-2 ring-purple-400/20 shadow-xs"
                        : "bg-neutral-50 dark:bg-slate-800 border-neutral-200 dark:border-slate-700 hover:border-neutral-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center">
                        <Shield size={14} />
                      </div>
                      <span className="font-bold text-xs text-purple-950 dark:text-purple-300">Faculty Administrator</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 dark:text-slate-300 leading-snug">
                      Departmental exam officer, syllabus board member, or HOD with full governance privileges.
                    </p>
                  </button>
                </div>
              </div>

              {/* Provision Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder={roleToAssign === "admin" ? "e.g. Dr. Ngozi Balogun" : "e.g. David Adeleke"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-neutral-900 dark:text-slate-100 placeholder:text-neutral-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                      {roleToAssign === "admin" ? "Staff ID / Number" : "Student Matric Number"}
                    </label>
                    <div className="relative">
                      <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder={roleToAssign === "admin" ? "STAFF/ENG/088" : "SWD/2023/1089"}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-neutral-900 dark:text-slate-100 uppercase placeholder:text-neutral-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                      Official Institutional Email
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="official.name@lucid.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-neutral-900 dark:text-slate-100 placeholder:text-neutral-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                      />
                    </div>
                  </div>

                  {roleToAssign === "courserep" ? (
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                        Assigned Course Representative Scope
                      </label>
                      <select
                        value={repCourseCode}
                        onChange={(e) => setRepCourseCode(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 text-xs text-neutral-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                      >
                        {courses.map((c) => (
                          <option key={c.code} value={`${c.code} (${c.title}) Rep`}>
                            {c.code} — {c.title} Rep
                          </option>
                        ))}
                        <option value="HND 1 General Class Representative">
                          HND 1 General Class Representative
                        </option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                        Faculty Designation / Staff Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sub-Dean & Examination Officer"
                        value={staffTitle}
                        onChange={(e) => setStaffTitle(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-neutral-900 dark:text-slate-100 placeholder:text-neutral-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-neutral-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-slate-300 mb-1">
                      Initial Access Password
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-slate-400" />
                        <input
                          type="text"
                          required
                          value={tempPassword}
                          onChange={(e) => setTempPassword(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-neutral-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-slate-800 hover:bg-neutral-200 dark:hover:bg-slate-700 text-neutral-700 dark:text-slate-300 text-xs font-semibold"
                        title="Generate random password"
                      >
                        Random
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/70 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 flex items-start gap-2.5">
                  <Shield size={16} className="text-purple-700 dark:text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Department Administrator Authorization</p>
                    <p className="text-[11px] text-purple-800/90 dark:text-purple-300/90 mt-0.5">
                      This account will be officially stamped as authorized by{" "}
                      <strong>{currentUser.name}</strong> ({currentUser.staffTitle || "HOD"}). The officer can sign in immediately using their ID or Email with the assigned access password.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-neutral-600 dark:text-slate-400 hover:bg-neutral-100 dark:hover:bg-slate-800 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 ${
                      roleToAssign === "admin"
                        ? "bg-purple-800 hover:bg-purple-900"
                        : "bg-amber-600 hover:bg-amber-700"
                    }`}
                  >
                    <Plus size={14} />
                    <span>
                      Assign & Provision {roleToAssign === "admin" ? "Administrator" : "Course Rep"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Success Voucher Screen */}
          {activeTab === "provision" && provisionedVoucher && (
            <div className="space-y-4 py-2 animate-scale-in">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto mb-2">
                <Check size={24} />
              </div>
              <div className="text-center">
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                  Account Successfully Provisioned!
                </h4>
                <p className="text-xs text-neutral-600 dark:text-slate-300 mt-0.5">
                  The account has been recorded in the institutional registry and is ready for immediate sign-in.
                </p>
              </div>

              {/* Official Voucher Card */}
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-slate-900 border border-neutral-200/90 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-slate-700">
                  <span className="text-[11px] font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-wider">
                    Official Access Voucher
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      provisionedVoucher.role === "admin"
                        ? "bg-purple-100 dark:bg-purple-950/70 text-purple-900 dark:text-purple-300"
                        : "bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300"
                    }`}
                  >
                    {provisionedVoucher.role === "admin" ? "Administrator" : "Course Rep"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-500 dark:text-slate-400 block text-[11px]">Officer Name</span>
                    <span className="font-bold text-neutral-900 dark:text-white">{provisionedVoucher.name}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 dark:text-slate-400 block text-[11px]">Staff / Matric ID</span>
                    <span className="font-bold text-neutral-900 dark:text-white font-mono">{provisionedVoucher.matricNo}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 dark:text-slate-400 block text-[11px]">Institutional Email</span>
                    <span className="font-medium text-neutral-800 dark:text-slate-200">{provisionedVoucher.email}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 dark:text-slate-400 block text-[11px]">Access Scope</span>
                    <span className="font-medium text-neutral-800 dark:text-slate-200">
                      {provisionedVoucher.role === "admin"
                        ? provisionedVoucher.staffTitle
                        : provisionedVoucher.repCourseCode}
                    </span>
                  </div>
                  <div className="col-span-2 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-500 dark:text-slate-400 uppercase">
                        Initial Access Password
                      </span>
                      <p className="font-mono font-bold text-sm text-[#006d64] dark:text-teal-400">
                        {provisionedVoucher.password}
                      </p>
                    </div>
                    <button
                      onClick={handleCopyVoucher}
                      className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-slate-700 hover:bg-neutral-200 dark:hover:bg-slate-600 text-xs font-semibold text-neutral-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      {copiedVoucher ? <Check size={13} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={13} />}
                      <span>{copiedVoucher ? "Copied!" : "Copy Voucher"}</span>
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-500 dark:text-slate-400 pt-1">
                  Assigned by: <strong>{provisionedVoucher.assignedBy}</strong> on {provisionedVoucher.assignedAt}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setProvisionedVoucher(null)}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 text-xs font-semibold text-neutral-700 dark:text-slate-200 hover:bg-neutral-50 dark:hover:bg-slate-700"
                >
                  + Provision Another Account
                </button>
                <button
                  onClick={() => setActiveTab("directory")}
                  className="px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white text-xs font-bold"
                >
                  View Registry Directory
                </button>
              </div>
            </div>
          )}

          {/* Directory Tab */}
          {activeTab === "directory" && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, matric no, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-neutral-900 dark:text-slate-100 placeholder:text-neutral-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600"
                  />
                </div>
                <div className="flex gap-1.5">
                  {(["all", "admin", "courserep", "student"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setFilterRole(r)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                        filterRole === r
                          ? "bg-neutral-900 dark:bg-purple-700 text-white"
                          : "bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-300 hover:bg-neutral-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users List */}
              <div className="space-y-2.5">
                {filteredRoster.map((usr) => (
                  <div
                    key={usr.id}
                    className="p-3.5 rounded-2xl bg-neutral-50/80 dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          usr.role === "admin"
                            ? "bg-purple-100 dark:bg-purple-950/70 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                            : usr.role === "courserep"
                            ? "bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                            : "bg-teal-100 dark:bg-teal-950/70 text-[#006d64] dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                        }`}
                      >
                        {usr.avatarInitials || usr.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-xs text-neutral-900 dark:text-white">{usr.name}</h5>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              usr.role === "admin"
                                ? "bg-purple-100 dark:bg-purple-950/70 text-purple-900 dark:text-purple-300"
                                : usr.role === "courserep"
                                ? "bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300"
                                : "bg-neutral-200 dark:bg-slate-700 text-neutral-700 dark:text-slate-200"
                            }`}
                          >
                            {usr.role}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500 dark:text-slate-400 mt-0.5">
                          <span className="font-mono">{usr.matricNo}</span>
                          <span>•</span>
                          <span>{usr.email}</span>
                          {usr.repCourseCode && (
                            <>
                              <span>•</span>
                              <span className="text-amber-800 dark:text-amber-300 font-medium">{usr.repCourseCode}</span>
                            </>
                          )}
                          {usr.staffTitle && (
                            <>
                              <span>•</span>
                              <span className="text-purple-800 dark:text-purple-300 font-medium">{usr.staffTitle}</span>
                            </>
                          )}
                        </div>
                        {usr.assignedBy && (
                          <p className="text-[10px] text-neutral-400 dark:text-slate-500 mt-1">
                            Assigned by: {usr.assignedBy} ({usr.assignedAt || "Verified"})
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {usr.id !== currentUser.id && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Revoke privileges for ${usr.name}?`)) {
                              onRevokeUser(usr.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-neutral-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Revoke / Remove Account"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 dark:bg-slate-950 border-t border-neutral-200 dark:border-slate-800 flex items-center justify-between shrink-0 text-xs text-neutral-500 dark:text-slate-400">
          <span>Security Protocol: Faculty RBAC Standard v2.4</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-purple-700 hover:bg-neutral-800 dark:hover:bg-purple-600 text-white font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
