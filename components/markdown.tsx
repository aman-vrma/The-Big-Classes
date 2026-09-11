import React from "react";

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  // A simple markdown renderer for the streamed content.
  // It handles basic paragraphs, headings, bold text, and lists.
  
  const parseMarkdown = (text: string) => {
    const lines = text.split("\n");
    let inList = false;
    let listItems: React.ReactNode[] = [];
    const elements: React.ReactNode[] = [];
    
    const pushListIfAny = () => {
      if (inList && listItems.length > 0) {
        elements.push(<ul key={`ul-${elements.length}`} className="list-disc pl-5 my-4 space-y-2">{listItems}</ul>);
        listItems = [];
        inList = false;
      }
    };

    const processText = (str: string) => {
      // Very basic bold parsing
      const parts = str.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    lines.forEach((line, index) => {
      if (line.startsWith("# ")) {
        pushListIfAny();
        elements.push(<h1 key={index} className="text-3xl font-serif mt-8 mb-4">{processText(line.substring(2))}</h1>);
      } else if (line.startsWith("## ")) {
        pushListIfAny();
        elements.push(<h2 key={index} className="text-2xl font-serif mt-6 mb-3">{processText(line.substring(3))}</h2>);
      } else if (line.startsWith("### ")) {
        pushListIfAny();
        elements.push(<h3 key={index} className="text-xl font-serif mt-5 mb-2">{processText(line.substring(4))}</h3>);
      } else if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        inList = true;
        listItems.push(<li key={index} className="text-muted-foreground leading-relaxed">{processText(line.trim().substring(2))}</li>);
      } else if (line.trim().match(/^\d+\.\s/)) {
        // treating numbered lists as bullets for simplicity in this minimal renderer, or just render it
        inList = true;
        const text = line.trim().replace(/^\d+\.\s/, "");
        listItems.push(<li key={index} className="text-muted-foreground leading-relaxed"><span className="font-medium text-foreground">{line.match(/^\d+\./)?.[0]}</span> {processText(text)}</li>);
      } else {
        pushListIfAny();
        if (line.trim()) {
          elements.push(<p key={index} className="mb-4 text-muted-foreground leading-relaxed">{processText(line)}</p>);
        }
      }
    });
    pushListIfAny();
    return elements;
  };

  return (
    <div className="markdown-body text-base max-w-none">
      {parseMarkdown(content)}
    </div>
  );
}

