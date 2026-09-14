import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { generateAIJson } from "./gemini";

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizResult {
  topic: string;
  questions: QuizQuestion[];
}

export interface GradeResult {
  marksAwarded: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface ClassroomHistoryItem {
  id: string;
  type: string;
  topic?: string;
  title?: string;
  subject?: string;
  createdAt: string;
  content: any;
}

const COLLECTION = "generatedContent";

export function getGetClassroomHistoryQueryKey(teacherId?: string) {
  return ["classroom-history", teacherId || "none"];
}

// Every generator (quiz, grade, lesson plan, assignment) saves its result through
// this, tagged with the owning teacher's uid, so each teacher only ever sees their
// own generated content.
export async function saveClassroomHistoryItem(
  teacherId: string,
  entry: Omit<ClassroomHistoryItem, "id" | "createdAt">
): Promise<void> {
  if (!teacherId) return;
  await addDoc(collection(db, COLLECTION), {
    ...entry,
    teacherId,
    createdAt: new Date().toISOString(),
  });
}

export function useGetClassroomHistory(teacherId?: string) {
  return useQuery({
    queryKey: getGetClassroomHistoryQueryKey(teacherId),
    enabled: !!teacherId,
    queryFn: async (): Promise<ClassroomHistoryItem[]> => {
      const q = query(collection(db, COLLECTION), where("teacherId", "==", teacherId));
      const snap = await getDocs(q);
      const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ClassroomHistoryItem, "id">) }));
      return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
  });
}

export function useDeleteClassroomHistoryItem(teacherId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, COLLECTION, id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetClassroomHistoryQueryKey(teacherId) });
    },
  });
}

export function useGenerateQuiz(teacherId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: any }): Promise<QuizResult> => {
      let prompt = `You are an expert professor. Create a ${data.numberOfQuestions}-question multiple choice quiz on the topic "${data.topic}" for the subject "${data.subject}" with difficulty level "${data.difficulty}".`;

      if (data.sourceContext) {
        prompt += `\nBase the questions specifically on this provided syllabus/study material:\n"""${data.sourceContext.slice(0, 4000)}"""`;
      }

      prompt += `\nReturn valid JSON matching this exact structure:
{
  "topic": "${data.topic}",
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "Exact matching string of the correct option",
      "explanation": "Clear explanation why this is correct."
    }
  ]
}`;

      const result = await generateAIJson<QuizResult>(prompt);

      if (teacherId) {
        await saveClassroomHistoryItem(teacherId, {
          type: "quiz",
          topic: data.topic,
          subject: data.subject,
          content: result,
        });
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetClassroomHistoryQueryKey(teacherId) });
    },
  });
}

export function useGradeAnswer(teacherId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: any }): Promise<GradeResult> => {
      let prompt = `Evaluate this student's response thoroughly.
Question: ${data.question}
Maximum Marks: ${data.maxMarks}
Strictness Level: ${data.strictness.toUpperCase()} (Lenient = reward effort and general understanding; Moderate = standard academic marking; Strict = penalize missing keywords, logic gaps, or inaccuracies).
Rubric / Key Points: ${data.rubric || "Standard conceptual depth and accuracy"}`;

      if (data.studentAnswer) {
        prompt += `\nStudent's Typed Answer: """${data.studentAnswer}"""`;
      }
      if (data.image) {
        prompt += `\nThe student has also provided an attached photo of their handwritten/printed answer sheet. Read the text from the image carefully and evaluate it against the question.`;
      }

      prompt += `\nReturn valid JSON matching this exact structure:
{
  "marksAwarded": number (between 0 and ${data.maxMarks}),
  "maxMarks": ${data.maxMarks},
  "percentage": number (0 to 100),
  "grade": "string (e.g. A+, A, B, C, F)",
  "feedback": "constructive 2-3 sentence overview",
  "strengths": ["Clear point 1", "Accurate reasoning point 2"],
  "improvements": ["Area to work on point 1"]
}`;

      const result = await generateAIJson<GradeResult>(prompt, data.image);

      if (teacherId) {
        await saveClassroomHistoryItem(teacherId, {
          type: "grade",
          topic: data.question.slice(0, 35) + "...",
          subject: "Answer Evaluation",
          content: result,
        });
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetClassroomHistoryQueryKey(teacherId) });
    },
  });
}
