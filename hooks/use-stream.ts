import { useState, useCallback } from "react";
import { generateAIStream } from "../lib/gemini";
import { useToast } from "./use-toast";

export function useStream() {
  const [content, setContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const { toast } = useToast();

  const startStream = useCallback(async (endpoint: string, body: any) => {
    setIsStreaming(true);
    setContent("");

    let prompt = "";
    if (endpoint.includes("lesson-plan")) {
      prompt = `Act as an expert university professor. Design an in-depth, structured academic lesson plan for:
Topic: ${body.topic}
Subject: ${body.subject}
Grade Level: ${body.gradeLevel}
Duration: ${body.duration || "60 minutes"}

Include:
# ${body.topic}: Academic Lesson Plan
## 1. Learning Objectives
## 2. Prerequisites & Background Knowledge
## 3. Teaching Outline & Step-by-Step Phases (with estimated timing)
## 4. Discussion Prompts & Active Learning Activities
## 5. Formative Assessment & Homework Suggestions

Format with clean Markdown, bold terms, and clear bullet points.`;
    } else if (endpoint.includes("assignment")) {
      prompt = `Act as an expert instructor. Create a rigorous academic assignment brief for:
Topic: ${body.topic}
Subject: ${body.subject}
Target Level: ${body.gradeLevel}
Assignment Type: ${body.assignmentType}

Include:
# Academic Assignment: ${body.topic}
## 1. Overview & Context
## 2. Learning Outcomes
## 3. Problem Statement & Detailed Deliverables
## 4. Evaluation Criteria & Rubric Breakdown
## 5. Submission Guidelines & Formatting Requirements

Format with clean Markdown.`;
    }

    try {
      await generateAIStream(prompt, (chunk) => {
        setContent(chunk);
      });
    } catch (err: any) {
      toast({
        title: "Generation Error",
        description: err.message || "Failed to stream content",
        variant: "destructive",
      });
    } finally {
      setIsStreaming(false);
    }
  }, [toast]);

  return { content, isStreaming, startStream };
}
