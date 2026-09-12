export type CandidateStatus = "in-progress" | "completed" | "disqualified";

export interface ExamCandidate {
  studentName: string;
  studentEmail?: string;
  roomCode: string;
  status: CandidateStatus;
  violations: number;
  score?: number;
  total?: number;
  percentage?: number;
  updatedAt: string;
}

export interface ExamRoom {
  roomCode: string;
  topic: string;
  subject: string;
  createdAt: string;
  durationMinutes: number;
  status: "active" | "closed";
  questions: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[];
}

const ROOM_STORAGE_KEY = "ai_classroom_exam_rooms";
const CANDIDATES_STORAGE_KEY = "ai_classroom_candidates_list";

export function getExamRooms(): ExamRoom[] {
  const data = localStorage.getItem(ROOM_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveExamRoom(room: ExamRoom) {
  const rooms = getExamRooms();
  const index = rooms.findIndex((r) => r.roomCode.toUpperCase() === room.roomCode.toUpperCase());
  if (index >= 0) {
    rooms[index] = room;
  } else {
    rooms.unshift(room);
  }
  localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(rooms));
}

export function closeExamRoom(code: string) {
  const rooms = getExamRooms();
  const index = rooms.findIndex((r) => r.roomCode.toUpperCase() === code.toUpperCase());
  if (index >= 0) {
    rooms[index].status = "closed";
    localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(rooms));
  }
}

export function findExamRoom(code: string): ExamRoom | undefined {
  const rooms = getExamRooms();
  return rooms.find((r) => r.roomCode.trim().toUpperCase() === code.trim().toUpperCase());
}

export function getAllCandidates(roomCode?: string): ExamCandidate[] {
  const data = localStorage.getItem(CANDIDATES_STORAGE_KEY);
  const candidates: ExamCandidate[] = data ? JSON.parse(data) : [];
  if (roomCode) {
    return candidates.filter((c) => c.roomCode.trim().toUpperCase() === roomCode.trim().toUpperCase());
  }
  return candidates;
}

export function updateCandidateStatus(candidate: ExamCandidate) {
  const list = getAllCandidates();
  const existingIdx = list.findIndex(
    (c) =>
      c.studentName.trim().toLowerCase() === candidate.studentName.trim().toLowerCase() &&
      c.roomCode.trim().toUpperCase() === candidate.roomCode.trim().toUpperCase()
  );

  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...candidate, updatedAt: new Date().toISOString() };
  } else {
    list.unshift({ ...candidate, updatedAt: new Date().toISOString() });
  }

  localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(list));
}

export function exportCandidatesToCSV(roomCode?: string) {
  const data = getAllCandidates(roomCode);
  if (data.length === 0) {
    alert("No student records found to export.");
    return;
  }

  const headers = ["Student Name", "Email", "Room Code", "Status", "Strikes", "Score", "Total", "Percentage", "Time"];
  const rows = data.map((c) => [
    `"${c.studentName}"`,
    `"${c.studentEmail || "N/A"}"`,
    `"${c.roomCode}"`,
    `"${c.status}"`,
    c.violations || 0,
    c.score ?? 0,
    c.total ?? 0,
    `"${c.percentage ?? 0}%"`,
    `"${new Date(c.updatedAt).toLocaleString()}"`,
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `exam_ledger_${roomCode || "all"}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Returns true if this email has already completed (or been disqualified from) this specific room's exam.
export function hasStudentAttempted(email: string, roomCode: string): boolean {
  if (!email || !roomCode) return false;
  const candidates = getAllCandidates(roomCode);
  return candidates.some(
    (c) =>
      (c.studentEmail || "").trim().toLowerCase() === email.trim().toLowerCase() &&
      (c.status === "completed" || c.status === "disqualified")
  );
}

// Returns every exam attempt (across all rooms) made by this email, newest first,
// with the room's topic/subject attached for display.
export function getCandidateHistory(email: string): (ExamCandidate & { topic?: string; subject?: string })[] {
  if (!email) return [];
  const rooms = getExamRooms();
  const all = getAllCandidates();

  return all
    .filter((c) => (c.studentEmail || "").trim().toLowerCase() === email.trim().toLowerCase())
    .map((c) => {
      const room = rooms.find((r) => r.roomCode.trim().toUpperCase() === c.roomCode.trim().toUpperCase());
      return { ...c, topic: room?.topic, subject: room?.subject };
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}